import { Link } from 'react-router-dom'
import { ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react'
function LoginPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.28),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.18),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
                <BrainCircuit size={22} />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                BlockMind
              </span>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
                <Sparkles size={15} />
                AI-powered crypto intelligence
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
                Your crypto world,
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                  curated for you.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Personalized market intelligence, daily insights and content
                shaped around the way you invest.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <Sparkles className="mb-4 text-violet-300" size={20} />
                  <p className="font-medium">Personalized insights</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Content tailored to your interests
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <ShieldCheck className="mb-4 text-blue-300" size={20} />
                  <p className="font-medium">Focused dashboard</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Signal over market noise
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              BlockMind · Personalized Crypto Intelligence
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="relative w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <BrainCircuit size={20} />
              </div>
              <span className="text-xl font-semibold">BlockMind</span>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-violet-300">
                Welcome back
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Sign in to BlockMind
              </h2>

              <p className="mt-3 text-slate-400">
                Access your personalized crypto dashboard.
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-slate-500 transition hover:text-violet-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 font-medium text-white shadow-[0_18px_50px_rgba(91,33,182,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(91,33,182,0.35)]"
              >
                Sign in
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.18em] text-slate-600">
                New here?
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
  to="/signup"
  className="block w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-center font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
>
  Create an account
</Link>

            <p className="mt-8 text-center text-xs leading-5 text-slate-600">
              By continuing, you agree to BlockMind&apos;s Terms and Privacy
              Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage