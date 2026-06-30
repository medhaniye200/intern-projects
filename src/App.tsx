import FiscalYearsPage from './app/calendar/fiscal-years/page';

function Dashboard() {
  return (
    <div>
      <h1>EthioERP Dashboard</h1>
      <p>Welcome to the ERP system dashboard.</p>
      <a href="/calendar/fiscal-years">Configure Fiscal Year</a>
    </div>
  );
}

export default function App() {
  return window.location.pathname.includes('/calendar/fiscal-years')
    ? <FiscalYearsPage />
    : <Dashboard />;
}
