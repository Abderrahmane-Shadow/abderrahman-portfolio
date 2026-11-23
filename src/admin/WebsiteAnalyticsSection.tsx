import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Users, 
  Eye, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Globe2, 
  Compass, 
  ExternalLink,
  Layers,
  Filter,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

type DateRange = '7d' | '14d' | '30d' | 'all';
type MetricView = 'visitors' | 'pageviews';

export const WebsiteAnalyticsSection: React.FC = () => {
  const { pageViews, refreshPageViews } = useData();
  const [dateRange, setDateRange] = useState<DateRange>('14d');
  const [metricView, setMetricView] = useState<MetricView>('visitors');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  // Manual refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPageViews();
      setRefreshNotice('Website analytics refreshed successfully.');
      setTimeout(() => setRefreshNotice(null), 3000);
    } catch {
      setRefreshNotice('Could not refresh analytics.');
      setTimeout(() => setRefreshNotice(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Date threshold helper
  const rangeDays = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : dateRange === '30d' ? 30 : 0;

  // Filtered dataset based on selected date range
  const filteredEvents = useMemo(() => {
    if (dateRange === 'all') return pageViews;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeDays);
    const cutoffTime = cutoff.getTime();

    return pageViews.filter((item) => {
      try {
        return new Date(item.visited_at).getTime() >= cutoffTime;
      } catch {
        return false;
      }
    });
  }, [pageViews, dateRange, rangeDays]);

  // Overall & Time-based KPI Metrics (Real Supabase Data)
  const metrics = useMemo(() => {
    const totalViews = filteredEvents.length;
    const uniqueVisitorsSet = new Set(filteredEvents.map(e => e.visitor_id));
    const totalUniqueVisitors = uniqueVisitorsSet.size;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const todayEvents = pageViews.filter(e => {
      try {
        return new Date(e.visited_at).toISOString().slice(0, 10) === todayStr;
      } catch {
        return false;
      }
    });
    const uniqueVisitorsToday = new Set(todayEvents.map(e => e.visitor_id)).size;

    const monthEvents = pageViews.filter(e => {
      try {
        return new Date(e.visited_at).toISOString().slice(0, 7) === currentYearMonth;
      } catch {
        return false;
      }
    });
    const uniqueVisitorsThisMonth = new Set(monthEvents.map(e => e.visitor_id)).size;

    return {
      totalViews,
      totalUniqueVisitors,
      uniqueVisitorsToday,
      uniqueVisitorsThisMonth,
    };
  }, [filteredEvents, pageViews]);

  // Chart Data calculation (7, 14, or 30 days)
  const chartDaysCount = rangeDays > 0 ? rangeDays : 14;
  const dailyChartData = useMemo(() => {
    return Array.from({ length: chartDaysCount }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (chartDaysCount - 1 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayEvents = pageViews.filter(item => {
        try {
          return new Date(item.visited_at).toISOString().slice(0, 10) === dateStr;
        } catch {
          return false;
        }
      });

      const pageViewsCount = dayEvents.length;
      const uniqueVisitorsCount = new Set(dayEvents.map(e => e.visitor_id)).size;

      return {
        dateStr,
        dayLabel,
        visitors: uniqueVisitorsCount,
        pageviews: pageViewsCount,
        value: metricView === 'visitors' ? uniqueVisitorsCount : pageViewsCount,
      };
    });
  }, [pageViews, chartDaysCount, metricView]);

  const maxChartValue = useMemo(() => {
    return Math.max(...dailyChartData.map(d => d.value), 1);
  }, [dailyChartData]);

  // Most Visited Pages Aggregation
  const topPages = useMemo(() => {
    const pageCounts: Record<string, { views: number; uniqueVisitors: Set<string> }> = {};

    filteredEvents.forEach(e => {
      const path = e.page_path || '/';
      if (!pageCounts[path]) {
        pageCounts[path] = { views: 0, uniqueVisitors: new Set() };
      }
      pageCounts[path].views += 1;
      pageCounts[path].uniqueVisitors.add(e.visitor_id);
    });

    const totalViewsCount = filteredEvents.length || 1;

    return Object.entries(pageCounts)
      .map(([path, data]) => ({
        path,
        views: data.views,
        unique: data.uniqueVisitors.size,
        percentage: Math.round((data.views / totalViewsCount) * 100),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [filteredEvents]);

  // Traffic Sources / Referrers Aggregation
  const topReferrers = useMemo(() => {
    const referrerCounts: Record<string, number> = {};

    filteredEvents.forEach(e => {
      let source = 'Direct / Bookmark';
      const ref = (e.referrer || '').trim();

      if (ref) {
        try {
          const url = new URL(ref);
          const host = url.hostname.toLowerCase();

          if (host.includes('google')) source = 'Google Search';
          else if (host.includes('linkedin')) source = 'LinkedIn';
          else if (host.includes('github')) source = 'GitHub';
          else if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) source = 'X (Twitter)';
          else if (host.includes('localhost') || host.includes('127.0.0.1')) source = 'Internal Preview';
          else source = host.replace(/^www\./, '');
        } catch {
          source = ref.slice(0, 30);
        }
      }

      referrerCounts[source] = (referrerCounts[source] || 0) + 1;
    });

    const total = filteredEvents.length || 1;

    return Object.entries(referrerCounts)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredEvents]);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Audience Traffic Insights</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Website Visitor Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Privacy-preserving tracking of anonymous visitors, page popularity, and traffic channels
          </p>
        </div>

        {/* Filter Controls & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date range filter pills */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded-lg transition-all ${dateRange === '7d' ? 'bg-white dark:bg-[#162238] text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('14d')}
              className={`px-2.5 py-1 rounded-lg transition-all ${dateRange === '14d' ? 'bg-white dark:bg-[#162238] text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              14 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded-lg transition-all ${dateRange === '30d' ? 'bg-white dark:bg-[#162238] text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${dateRange === 'all' ? 'bg-white dark:bg-[#162238] text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              All Time
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Refresh website analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {refreshNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Unique Visitors */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Unique Visitors</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalUniqueVisitors}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Distinct devices ({dateRange === 'all' ? 'all-time' : `past ${rangeDays}d`})
          </div>
        </div>

        {/* Total Page Views */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Page Views</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {metrics.totalViews}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Public page & section navigations
          </div>
        </div>

        {/* Visitors Today */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Visitors Today</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {metrics.uniqueVisitorsToday}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Unique visitors active today
          </div>
        </div>

        {/* Visitors This Month */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Visitors This Month</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            {metrics.uniqueVisitorsThisMonth}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Current recruitment calendar cycle
          </div>
        </div>

      </div>

      {/* Daily Activity Chart */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Audience Trend ({chartDaysCount} Days)
            </span>
            <span className="text-[11px] text-slate-400">
              Peak: {maxChartValue > 1 ? maxChartValue : pageViews.length > 0 ? 1 : 0} {metricView === 'visitors' ? 'visitor(s)' : 'view(s)'}
            </span>
          </div>

          {/* Toggle between Unique Visitors and Page Views */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setMetricView('visitors')}
              className={`px-2.5 py-1 rounded-md transition-all ${metricView === 'visitors' ? 'bg-white dark:bg-[#162238] text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Unique Visitors
            </button>
            <button
              onClick={() => setMetricView('pageviews')}
              className={`px-2.5 py-1 rounded-md transition-all ${metricView === 'pageviews' ? 'bg-white dark:bg-[#162238] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Page Views
            </button>
          </div>
        </div>

        {/* Visual Daily Bars */}
        <div 
          className="gap-1 sm:gap-1.5 items-end h-36 pt-4"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${chartDaysCount}, minmax(0, 1fr))` }}
        >
          {dailyChartData.map((item) => {
            const hasData = item.value > 0;
            const heightPercent = maxChartValue > 0 && item.value > 0 
              ? Math.max(Math.round((item.value / maxChartValue) * 100), 14) 
              : 4;

            return (
              <div key={item.dateStr} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 dark:text-slate-200 mb-1 whitespace-nowrap">
                  {item.value}
                </div>

                {/* Bar */}
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[20px] rounded-t-md transition-all duration-300 ${
                      hasData
                        ? metricView === 'visitors'
                          ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-sm group-hover:from-blue-700 group-hover:to-sky-300'
                          : 'bg-gradient-to-t from-indigo-600 to-purple-400 shadow-sm group-hover:from-indigo-700 group-hover:to-purple-300'
                        : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                    }`}
                    title={`${item.dayLabel}: ${item.visitors} unique visitors, ${item.pageviews} page views`}
                  />
                </div>

                {/* Day label */}
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                  {item.dayLabel.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500">
          <span>{dailyChartData[0]?.dayLabel}</span>
          <span className="italic">Hover over bars to inspect daily metrics</span>
          <span>{dailyChartData[dailyChartData.length - 1]?.dayLabel} (Today)</span>
        </div>
      </div>

      {/* Breakdown Grid: Top Pages & Traffic Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Visited Pages Table */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Most Visited Pages & Sections
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              {topPages.length} tracked path(s)
            </span>
          </div>

          {topPages.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No page view records logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topPages.map((page, idx) => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className="w-4 text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate" title={page.path}>
                        {page.path === '/' ? '/ (Home Hero)' : page.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>{page.unique} visitor(s)</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900 dark:text-white">{page.views} views</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${page.percentage}%` }}
                      className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic Sources / Referrers */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Traffic Sources & Referrers
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              {topReferrers.length} channel(s)
            </span>
          </div>

          {topReferrers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No traffic source information recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topReferrers.map((ref) => (
                <div key={ref.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={ref.source}>
                      {ref.source}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>{ref.percentage}%</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900 dark:text-white">{ref.count} visit(s)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${ref.percentage}%` }}
                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Empty State Banner when no traffic exists */}
      {pageViews.length === 0 && (
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Globe2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Live Visitor Tracking Active:</div>
            <div>
              Visits to your public portfolio are being tracked in real time. Once visitors open your portfolio or explore your projects, their anonymous page view events will immediately populate these charts and tables.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
