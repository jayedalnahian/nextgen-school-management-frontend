import LoginFormAuth from "@/components/modules/auth/LoginFormAuth";
// Forced rebuild to fix hydration mismatch


interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <LoginFormAuth redirectPath={redirectPath}/>
  )
}

export default LoginPage