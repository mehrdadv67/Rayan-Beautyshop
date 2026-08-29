import Input from '@components/ui/input';
import PasswordInput from '@components/ui/password-input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import Logo from '@components/ui/logo';
import { useUI } from '@contexts/ui.context';
import { useSignUpMutation, SignUpInputType } from '@framework/auth/use-signup';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const SignUpForm: React.FC = () => {
  const { t } = useTranslation('common');
  const { mutate: signUp, isPending, error } = useSignUpMutation();
  const { setModalView, openModal, closeModal } = useUI();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInputType>();
  const watchPassword = watch('password');

  function handleSignIn() {
    setModalView('LOGIN_VIEW');
    return openModal();
  }

  function onSubmit(data: SignUpInputType) {
    signUp(data);
  }

  function handleOtpSignUp() {
    toast.info(t('common:text-otp-coming-soon'));
  }

  return (
    <div className="py-5 px-5 sm:px-8 bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300 max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-2 mb-8 sm:mb-10">
          {t('common:registration-helper')}{' '}
          <Link
            href={ROUTES.TERMS}
            className="text-heading underline hover:no-underline focus:outline-none"
          >
            {t('common:text-terms')}
          </Link>{' '}
          &amp;{' '}
          <Link
            href={ROUTES.POLICY}
            className="text-heading underline hover:no-underline focus:outline-none"
          >
            {t('common:text-policy')}
          </Link>
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-4">
          <Input
            labelKey="forms:label-username"
            type="text"
            variant="solid"
            {...register('username', {
              required: 'forms:name-required',
            })}
            errorKey={errors.username?.message}
          />
          <div className="flex flex-col sm:flex-row sm:gap-x-3 space-y-4 sm:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              type="text"
              variant="solid"
              {...register('firstName')}
              className="w-full sm:w-1/2"
            />
            <Input
              labelKey="forms:label-last-name"
              type="text"
              variant="solid"
              {...register('lastName')}
              className="w-full sm:w-1/2 ltr:sm:ml-3 rtl:sm:mr-3"
            />
          </div>
          <Input
            labelKey="forms:label-email"
            type="email"
            variant="solid"
            {...register('email', {
              required: `${t('forms:email-required')}`,
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: t('forms:email-error'),
              },
            })}
            errorKey={errors.email?.message}
          />
          <Input
            labelKey="forms:label-phone"
            type="tel"
            variant="solid"
            {...register('phoneNumber')}
          />
          <Input
            labelKey="forms:label-address"
            type="text"
            variant="solid"
            {...register('address')}
          />
          <div className="flex flex-col sm:flex-row sm:gap-x-3 space-y-4 sm:space-y-0">
            <Input
              labelKey="forms:label-city"
              type="text"
              variant="solid"
              {...register('city')}
              className="w-full sm:w-1/2"
            />
            <Input
              labelKey="forms:label-postcode"
              type="text"
              variant="solid"
              {...register('zipCode')}
              className="w-full sm:w-1/2 ltr:sm:ml-3 rtl:sm:mr-3"
            />
          </div>
          <div className="relative flex flex-col">
            <span className="mt-2 text-sm text-heading font-semibold block pb-1">
              {t('common:text-gender')}
            </span>
            <div className="mt-2 flex items-center gap-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  {...register('gender')}
                  className="ml-2"
                />
                {t('forms:label-male')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className="ml-2"
                />
                {t('forms:label-female')}
              </label>
            </div>
          </div>
          <PasswordInput
            labelKey="forms:label-password"
            errorKey={errors.password?.message}
            {...register('password', {
              required: 'forms:password-required',
              minLength: {
                value: 8,
                message: 'forms:password-min-length',
              },
            })}
          />
          <PasswordInput
            labelKey="forms:label-confirm-password"
            errorKey={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'forms:password-confirm-required',
              validate: (value) => value === watchPassword || 'forms:password-confirm-match',
            })}
          />
        </div>
        <div className="relative">
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
            className="h-11 md:h-12 w-full mt-2"
          >
            {t('common:text-register')}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error?.message || t('common:text-signup-error')}
          </p>
        )}
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-6 mb-3.5">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-white">
          {t('common:text-or')}
        </span>
      </div>
      <Button
        type="button"
        loading={isPending}
        disabled={isPending}
        className="h-11 md:h-12 w-full mt-2.5 bg-gray-500 hover:bg-gray-600"
        onClick={handleOtpSignUp}
      >
         {t('common:text-signup-with-otp')}
      </Button>
      <div className="text-sm sm:text-base text-body text-center mt-5 mb-1">
        {t('common:text-have-account')}{' '}
        <button
          type="button"
          className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:outline-none"
          onClick={handleSignIn}
        >
          {t('common:text-login')}
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
