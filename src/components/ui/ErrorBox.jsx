import { useI18n } from '../../i18n/LanguageContext.jsx';
import { btn } from './styles.js';

export default function ErrorBox({ error, onRetry }) {
  const { t } = useI18n();
  const notFound = error?.status === 404;
  return (
    <div className="rounded-xl border border-red-900 bg-red-950/50 p-4 text-center" role="alert">
      <p className="text-red-200">{notFound ? `${t.ui.notFound}.` : t.ui.networkError}</p>
      {!notFound && onRetry && (
        <button onClick={onRetry} className={`${btn} mt-3 bg-red-600 text-white hover:bg-red-500`}>
          {t.ui.retry}
        </button>
      )}
    </div>
  );
}
