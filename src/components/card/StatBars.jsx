import { STAT_MAX, STATS } from '../../constants.js';
import { useI18n } from '../../i18n/LanguageContext.jsx';

const ROW = 'grid grid-cols-[9.5rem_2.5rem_1fr] items-center gap-3';

export default function StatBars({ stats }) {
  const { t } = useI18n();
  const valueOf = (key) => stats.find((x) => x.stat.name === key)?.base_stat ?? 0;
  const total = stats.reduce((sum, x) => sum + x.base_stat, 0);

  return (
    <dl className="space-y-2">
      {STATS.map((key) => {
        const value = valueOf(key);
        return (
          <div key={key} className={ROW}>
            <dt className="text-slate-300">{t.stats[key]}</dt>
            <dd className="text-right font-semibold tabular-nums">{value}</dd>
            <dd className="h-2.5 overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-700"
                style={{ width: `${(value / STAT_MAX) * 100}%` }}
              ></div>
            </dd>
          </div>
        );
      })}
      <div className={`${ROW} border-t border-slate-700 pt-2`}>
        <dt className="font-semibold text-slate-300">{t.stats.total}</dt>
        <dd className="text-right font-bold tabular-nums">{total}</dd>
      </div>
    </dl>
  );
}
