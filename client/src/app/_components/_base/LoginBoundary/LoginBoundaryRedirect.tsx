'use client';

export default function LoginBoundaryRedirect() {
  // if (!user) redirect(`/auth/login`, RedirectType.push);

  // TODO redirect to login along with current url

  return (
    <>
      <div className="text-red-600">error: not logged in</div>
    </>
  );
}
