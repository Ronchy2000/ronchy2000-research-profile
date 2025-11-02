"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Update = {
  title: string;
  summary: string;
  type: string;
  date: string;
  link: string;
};

type InfiniteScrollUpdatesProps = {
  updates: Update[];
};

export function InfiniteScrollUpdates({ updates }: InfiniteScrollUpdatesProps) {
  const GAP_PX = 16;
  const MIN_CARD_WIDTH = 320;
  const MAX_COLUMNS = 3;
  const TRANSITION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
  const TRANSITION_MS = 450;
  const CARD_TRANSITION = `flex-basis ${TRANSITION_MS}ms ${TRANSITION_EASING}, width ${TRANSITION_MS}ms ${TRANSITION_EASING}, box-shadow 250ms ease, transform 250ms ease`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const previousStrideRef = useRef(0);
  const manualScrollRef = useRef(false);
  const lastStableIndexRef = useRef(0);
  const nextCandidateIndexRef = useRef(0);
  const previousSidebarStateRef = useRef<boolean | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [layout, setLayout] = useState(() => ({
    width: 0,
    columns: 1,
    cardWidth: 0,
    visibleSlots: 1
  }));

  const updatesCount = updates.length;
  const cardStride = layout.cardWidth ? layout.cardWidth + GAP_PX : 0;
  const totalContentWidth =
    updatesCount > 0
      ? updatesCount * layout.cardWidth + Math.max(0, updatesCount - 1) * GAP_PX
      : 0;
  
  // 侧边栏存在时（列数<3），否则纯手动滚动
  const sidebarVisible = layout.columns < 3;
  // 移除自动滚动，所有情况下都使用单个副本
  const trackUpdates = updates;

  // 移除了自动滚动功能，不再需要检测动画偏好

  // Observe container width to derive card sizing.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = entry.contentRect.width;
      if (!width) return;

      const rawColumns = Math.max(
        1,
        Math.min(MAX_COLUMNS, (width + GAP_PX) / (MIN_CARD_WIDTH + GAP_PX))
      );
      const lowerSlots = Math.floor(rawColumns);
      const upperSlots = Math.min(MAX_COLUMNS, Math.max(lowerSlots + 1, 1));
      const t = rawColumns - lowerSlots;
      const smoothT = t * t * (3 - 2 * t);

      const widthForSlots = (slots: number) => {
        if (slots <= 1) return width;
        const available = width - GAP_PX * (slots - 1);
        return available > 0 ? available / slots : width / slots;
      };

      const lowerWidth = widthForSlots(Math.max(lowerSlots, 1));
      const upperWidth = widthForSlots(upperSlots);
      const nextCardWidth =
        lowerSlots === upperSlots
          ? lowerWidth
          : lowerWidth * (1 - smoothT) + upperWidth * smoothT;

      const nextColumns = Math.max(1, Math.min(MAX_COLUMNS, Math.round(rawColumns)));
      const nextVisible = rawColumns;

      setLayout((prev) => {
        if (
          Math.abs(prev.width - width) < 0.25 &&
          Math.abs(prev.cardWidth - nextCardWidth) < 0.25 &&
          Math.abs(prev.visibleSlots - nextVisible) < 0.05 &&
          prev.columns === nextColumns
        ) {
          return prev;
        }
        return {
          width,
          columns: nextColumns,
          cardWidth: nextCardWidth,
          visibleSlots: nextVisible
        };
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // 简化的布局效果：不再需要循环滚动
  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const stride = cardStride;
    const smoothAdjust = hasMountedRef.current;
    const defaultBehavior: ScrollBehavior = smoothAdjust ? "smooth" : "auto";
    const snapTo = (left: number, behavior: ScrollBehavior = defaultBehavior) => {
      if (typeof scrollContainer.scrollTo === "function") {
        scrollContainer.scrollTo({ left, behavior });
        return;
      }
      scrollContainer.scrollLeft = left;
    };

    const prevStride = previousStrideRef.current;
    
    // 只在stride变化时调整位置，保持当前banner索引
    if (stride && prevStride && Math.abs(stride - prevStride) > 0.25 && !isTransitioningRef.current) {
      const currentScroll = scrollContainer.scrollLeft;
      const index = Math.max(0, Math.floor((currentScroll + 0.001) / prevStride));
      
      // 在新的stride下保持相同的索引
      snapTo(index * stride, 'auto');
    }
    
    previousStrideRef.current = stride;
    hasMountedRef.current = true;
  }, [cardStride]);

  const updateIndices = useCallback(
    (left: number) => {
      const stride = layout.cardWidth ? layout.cardWidth + GAP_PX : 0;
      if (!stride || updatesCount === 0) return;

      const maxIndex = Math.max(0, updatesCount - 1);
      const maxScroll = Math.max(0, totalContentWidth - layout.width);
      const clampedLeft = Math.max(0, Math.min(left, maxScroll));
      const fractional = clampedLeft / stride;

      const clampedFractional = Math.min(maxIndex + 0.999, Math.max(0, fractional));
      const leftIndex = Math.floor(clampedFractional);
      const progress = clampedFractional - leftIndex;
      const afterIndex = Math.min(maxIndex, leftIndex + 1);
      const threshold = 0.15;

      // 确定哪个banner应该是"下一个"（即将完全显示的）
      nextCandidateIndexRef.current = progress > threshold ? afterIndex : leftIndex;
      // 确定哪个banner是"最后稳定的"（当前主要可见的）
      lastStableIndexRef.current = progress < 1 - threshold ? leftIndex : afterIndex;
    },
    [layout.cardWidth, layout.width, totalContentWidth, updatesCount]
  );

  const stopScrollAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const smoothScrollTo = useCallback(
    (
      element: HTMLElement,
      to: number,
      behavior: ScrollBehavior,
      duration = TRANSITION_MS,
      onComplete?: () => void
    ) => {
      stopScrollAnimation();
      if (behavior === "auto" || !hasMountedRef.current) {
        element.scrollLeft = to;
        updateIndices(to);
        onComplete?.();
        return;
      }

      const start = element.scrollLeft;
      const distance = to - start;
      if (Math.abs(distance) < 0.5) {
        onComplete?.();
        return;
      }

      const startTime = performance.now();

      const step = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        // ease-in-out quint
        const eased = progress < 0.5 ? 16 * progress * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 5) / 2;
        const newScrollLeft = start + distance * eased;
        element.scrollLeft = newScrollLeft;
        updateIndices(newScrollLeft);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          animationFrameRef.current = null;
          onComplete?.();
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [TRANSITION_MS, stopScrollAnimation, updateIndices]
  );

  const alignToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      const stride = layout.cardWidth ? layout.cardWidth + GAP_PX : 0;
      if (!stride) return;

      const targetIndex = Math.max(0, Math.min(updatesCount - 1, index));
      const targetScroll = targetIndex * stride;
      const maxScroll = Math.max(0, totalContentWidth - layout.width);
      const target = Math.max(0, Math.min(maxScroll, targetScroll));

      smoothScrollTo(scrollContainer, target, behavior);
    },
    [
      layout.cardWidth,
      layout.width,
      updatesCount,
      totalContentWidth,
      smoothScrollTo,
    ]
  );

  const alignToNearestCard = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      const stride = layout.cardWidth ? layout.cardWidth + GAP_PX : 0;
      if (!stride) return;

      const current = scrollContainer.scrollLeft;
      const maxIndex = Math.max(0, updatesCount - 1);
      const index = Math.max(0, Math.min(maxIndex, Math.round(current / stride)));

      alignToIndex(index, behavior);
    },
    [alignToIndex, layout.cardWidth, updatesCount]
  );

  // 监听用户手动滚动
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    let scrollingTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (isTransitioningRef.current) return; // 过渡期间忽略滚动事件
      
      if (manualScrollRef.current) {
        stopScrollAnimation();
      }
      setIsScrolling(true);
      updateIndices(scrollContainer.scrollLeft);
      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(() => {
        setIsScrolling(false);
        if (manualScrollRef.current) {
          alignToNearestCard();
        }
      }, 220);

      if (manualScrollRef.current) {
        setIsUserScrolling(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsUserScrolling(false);
          manualScrollRef.current = false;
        }, 2000);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // 支持横向滚轮
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaX;
      }

      stopScrollAnimation();
      updateIndices(scrollContainer.scrollLeft);
      manualScrollRef.current = true;
      setIsScrolling(true);
      setIsUserScrolling(true);
      clearTimeout(scrollingTimeout);
      clearTimeout(scrollTimeout);
      scrollingTimeout = setTimeout(() => {
        setIsScrolling(false);
        alignToNearestCard();
      }, 220);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
        manualScrollRef.current = false;
      }, 2000);
    };

    const handleTouchMove = () => {
      manualScrollRef.current = true;
      stopScrollAnimation();
      setIsScrolling(true);
      setIsUserScrolling(true);
      updateIndices(scrollContainer.scrollLeft);
      clearTimeout(scrollingTimeout);
      clearTimeout(scrollTimeout);
      scrollingTimeout = setTimeout(() => {
        setIsScrolling(false);
        alignToNearestCard();
      }, 220);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
        manualScrollRef.current = false;
      }, 2000);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(scrollTimeout);
      clearTimeout(scrollingTimeout);
    };
  }, [alignToNearestCard, stopScrollAnimation, updateIndices]);

  // 智能位置保持：侧边栏状态变化时平滑过渡到合适的锚点
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const prevSidebar = previousSidebarStateRef.current;
    const currentSidebar = sidebarVisible;

    if (prevSidebar === null) {
      previousSidebarStateRef.current = currentSidebar;
      updateIndices(scrollContainer.scrollLeft);
      return;
    }

    if (prevSidebar === currentSidebar) {
      previousSidebarStateRef.current = currentSidebar;
      return;
    }

    // 侧边栏状态发生变化时，需要智能选择锚点
    isTransitioningRef.current = true;
    manualScrollRef.current = false;
    setIsUserScrolling(false);
    
    // 根据侧边栏的显示/隐藏状态选择不同的锚点策略
    let targetIndex: number;
    
    if (currentSidebar) {
      // 侧边栏从隐藏变为显示：选择当前最左侧的稳定banner
      targetIndex = lastStableIndexRef.current;
    } else {
      // 侧边栏从显示变为隐藏：选择"下一个"即将完全展示的banner
      targetIndex = nextCandidateIndexRef.current;
    }

    let timeoutId: number | null = null;

    requestAnimationFrame(() => {
      alignToIndex(targetIndex, "smooth");
      timeoutId = window.setTimeout(() => {
        isTransitioningRef.current = false;
      }, TRANSITION_MS + 50);
    });

    previousSidebarStateRef.current = currentSidebar;

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [alignToIndex, sidebarVisible, updateIndices, TRANSITION_MS]);

  useEffect(() => {
    if (!isTransitioningRef.current) {
      alignToNearestCard("auto");
    }
  }, [alignToNearestCard]);

  useEffect(() => stopScrollAnimation, [stopScrollAnimation]);

  // 鼠标拖动滚动
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;
      
      e.preventDefault();
      stopScrollAnimation();
      const x = e.pageX;
      const walk = (dragStart.x - x) * 1.5;
      scrollContainer.scrollLeft = dragStart.scrollLeft + walk;
      updateIndices(scrollContainer.scrollLeft);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        alignToNearestCard();
      }, 50);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, alignToNearestCard, stopScrollAnimation, updateIndices]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    e.preventDefault();
    stopScrollAnimation();
    
    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      scrollLeft: scrollContainer.scrollLeft
    });
  }, [stopScrollAnimation]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    // 不在这里设置 isDragging 为 false，让全局监听器处理
  }, []);

  if (!updatesCount) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        Updates will appear here soon. Stay tuned!
      </div>
    );
  }

  const itemDimension =
    layout.cardWidth > 0
      ? { flexBasis: `${layout.cardWidth}px`, width: `${layout.cardWidth}px` }
      : undefined;

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        {trackUpdates.map((update, index) => (
          <article
            key={`${update.title}-${index}`}
            className="flex min-w-[260px] flex-shrink-0 flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.3)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-900/70"
            style={{
              ...itemDimension,
              transition: CARD_TRANSITION
            }}
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {update.type} · {update.date}
              </p>
              <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">{update.title}</h3>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{update.summary}</p>
            </div>
            <a href={update.link} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-foreground transition-colors">
              View details
              <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>

      {/* 简化的滚动状态提示 */}
      {isDragging && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-medium dark:bg-white/80 dark:text-slate-900 backdrop-blur-sm transition-all duration-300">
          🖱️ Dragging...
        </div>
      )}
    </div>
  );
}
