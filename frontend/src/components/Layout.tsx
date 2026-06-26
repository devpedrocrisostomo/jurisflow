import { Outlet } from 'react-router-dom';
import Sidebar, { MobileNavigation } from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="min-h-screen px-4 pb-28 pt-5 lg:ml-64 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
}