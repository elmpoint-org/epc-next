import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';
import UsersList from './_components/UsersList';

export default function Page() {
  return (
    <LoginBoundary scope={['EDIT']}>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Users
        </h1>
        <div className="container flex-1 rounded-lg bg-dwhite">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
            <UsersList />
          </div>
        </div>
      </div>
    </LoginBoundary>
  );
}
