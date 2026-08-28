import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Sparkles,
  Target,
} from 'lucide-react'

function SignupPage() {
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
                Built around your investing style
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
                Less noise.
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                  More signal.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Tell BlockMind what matters to you and get a daily crypto
                dashboard shaped around your interests.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex max-w-lg items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Target size={19} />
                  </div>
                  <div>
                    <p className="font-medium">Choose what matters</p>
                    <p className="text-sm text-slate-500">
                      Assets, content and investing style
                    </p>
                  </div>
                </div>

                <div className="flex max-w-lg items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <ChartNoAxesCombined size={19} />
                  </div>
                  <div>
                    <p className="font-medium">Get your daily intelligence</p>
                    <p className="text-sm text-slate-500">
                      One dashboard, personalized for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              BlockMind · Personalized Crypto Intelligence
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="relative w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <BrainCircuit size={20} />
              </div>
              <span className="text-xl font-semibold">BlockMind</span>
            </div>

            <div className="mb-7">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-violet-300">
                Get started
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="mt-3 text-slate-400">
                Your personalized crypto feed starts here.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 font-medium text-white shadow-[0_18px_50px_rgba(91,33,182,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(91,33,182,0.35)]"
              >
                Create account
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.18em] text-slate-600">
                Already a member?
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/login"
              className="block w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-center font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Sign in instead
            </Link>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              By creating an account, you agree to BlockMind&apos;s Terms and
              Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SignupPage