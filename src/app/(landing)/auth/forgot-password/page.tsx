import { CopyrightFooter } from "@/components/copyright-footer";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ForgotPasswordForm />
        <CopyrightFooter />
      </div>
    </div>
  );
}
