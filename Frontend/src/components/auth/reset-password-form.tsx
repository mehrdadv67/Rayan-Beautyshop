import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Logo from "@components/ui/logo";
import { useForm } from "react-hook-form";
import { useUI } from "@contexts/ui.context";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useResetPasswordMutation, ResetPasswordInputType } from "@framework/auth/use-reset-password";

type FormValues = ResetPasswordInputType;

const defaultValues = {
  password: "",
  passwordConfirmation: "",
  code: "",
};

const ResetPasswordForm = () => {
  const { t } = useTranslation('common');
  const { setModalView, openModal, closeModal } = useUI();
  const router = useRouter();
  const code = router.query.code as string | undefined;
  const { mutate: resetPassword, isPending, error } = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { ...defaultValues, code: code || '' },
  });
  const watchPassword = watch('password');

  function handleSignIn() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  const onSubmit = (values: FormValues) => {
    resetPassword(values);
  };

  return (
    <div className="py-6 px-5 sm:p-8 bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300">
      <div className="text-center mb-9 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
          {t("common:reset-password-helper")}
        </p>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col justify-center"
        noValidate
      >
        <Input
          labelKey="forms:label-reset-code"
          type="text"
          variant="solid"
          className="mb-4"
          {...register("code", {
            required: `${t("forms:code-required")}`,
          })}
          errorKey={errors.code?.message}
        />
        <PasswordInput
          labelKey="forms:label-password"
          errorKey={errors.password?.message}
          {...register("password", {
            required: `${t("forms:password-required")}`,
            minLength: {
              value: 8,
              message: `${t("forms:password-min-length")}`,
            },
          })}
          className="mb-4"
        />
        <PasswordInput
          labelKey="forms:label-confirm-password"
          errorKey={errors.passwordConfirmation?.message}
          {...register("passwordConfirmation", {
            required: `${t("forms:password-confirm-required")}`,
            validate: (value) =>
              value === watchPassword || `${t("forms:password-confirm-match")}`,
          })}
          className="mb-4"
        />
        <Button type="submit" className="h-11 md:h-12 w-full mt-2" loading={isPending} disabled={isPending}>
          {t("common:text-reset-password")}
        </Button>
      </form>
      {error && (
        <p className="text-sm text-red-500 mt-4 text-center">
           {error?.message || t('common:text-reset-password-error')}
        </p>
      )}
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-10 mb-6 sm:mb-7">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-white">
          {t("common:text-or")}
        </span>
      </div>
      <div className="text-sm sm:text-base text-body text-center">
        {t("common:text-back-to")}{" "}
        <button
          type="button"
          className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:outline-none"
          onClick={handleSignIn}
        >
          {t("common:text-login")}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
