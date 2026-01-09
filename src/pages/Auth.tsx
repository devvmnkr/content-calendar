import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarsBackground } from "@/components/ui/stars-background";
import { cn } from "@/lib/utils";

// Local constants for this component
const STRINGS = {
  LOGIN_TITLE: "Welcome Back",
  LOGIN_SUBTITLE: "Sign in to continue to your dashboard",
  REGISTER_TITLE: "Create Account",
  REGISTER_SUBTITLE: "Get started with your content journey",
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "you@example.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  NAME_LABEL: "Name",
  NAME_PLACEHOLDER: "Your name",
  LOGIN_BUTTON: "Sign In",
  REGISTER_BUTTON: "Create Account",
  GOOGLE_BUTTON: "Continue with Google",
  OR_DIVIDER: "or",
  TOGGLE_TO_REGISTER: "Don't have an account?",
  TOGGLE_TO_LOGIN: "Already have an account?",
  REGISTER_LINK: "Sign up",
  LOGIN_LINK: "Sign in",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  INVALID_EMAIL: "Please enter a valid email address",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;

const ARIA = {
  SHOW_PASSWORD: "Show password",
  HIDE_PASSWORD: "Hide password",
} as const;

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function Auth() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = STRINGS.EMAIL_REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = STRINGS.INVALID_EMAIL;
    }

    if (!formData.password) {
      newErrors.password = STRINGS.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = STRINGS.PASSWORD_MIN_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(
        formData.email,
        formData.password,
        !isLogin ? formData.name : undefined
      );
      navigate("/");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { code?: string } };
      };
      if (axiosError.response?.data?.code === "INVALID_CREDENTIALS") {
        setErrors({ general: STRINGS.INVALID_CREDENTIALS });
      } else {
        setErrors({ general: STRINGS.GENERIC_ERROR });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Google Sign-in will be implemented later
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: "", password: "", name: "" });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-8">
      <StarsBackground starCount={100} parallaxStrength={25} />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border-default bg-bg/90 p-6 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-bold text-text-primary">
              {isLogin ? STRINGS.LOGIN_TITLE : STRINGS.REGISTER_TITLE}
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              {isLogin ? STRINGS.LOGIN_SUBTITLE : STRINGS.REGISTER_SUBTITLE}
            </p>
          </div>

          {/* Google Sign-in */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full gap-3"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon className="h-5 w-5" />
            {STRINGS.GOOGLE_BUTTON}
          </Button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg px-2 text-text-tertiary">
                {STRINGS.OR_DIVIDER}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name field (register only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  {STRINGS.NAME_LABEL}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={STRINGS.NAME_PLACEHOLDER}
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {STRINGS.EMAIL_LABEL}
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={STRINGS.EMAIL_PLACEHOLDER}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  className="pr-10"
                  autoComplete="email"
                />
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              </div>
              {errors.email && (
                <p className="text-xs text-accent1-main">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {STRINGS.PASSWORD_LABEL}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={STRINGS.PASSWORD_PLACEHOLDER}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  className="pr-10"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  aria-label={
                    showPassword ? ARIA.HIDE_PASSWORD : ARIA.SHOW_PASSWORD
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-accent1-main">{errors.password}</p>
              )}
            </div>

            {/* General error */}
            {errors.general && (
              <div className="rounded-lg bg-accent1-subtle p-3 text-center text-sm text-accent1-main">
                {errors.general}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "..."
                : isLogin
                ? STRINGS.LOGIN_BUTTON
                : STRINGS.REGISTER_BUTTON}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="mt-5 text-center text-sm text-text-secondary">
            {isLogin ? STRINGS.TOGGLE_TO_REGISTER : STRINGS.TOGGLE_TO_LOGIN}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className={cn(
                "font-medium text-primary-main hover:text-primary-hover",
                "underline-offset-4 hover:underline"
              )}
            >
              {isLogin ? STRINGS.REGISTER_LINK : STRINGS.LOGIN_LINK}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
