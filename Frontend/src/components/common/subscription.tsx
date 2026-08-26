import Text from '@components/ui/text';
import Input from '@components/ui/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { csrfHeaders } from '@utils/csrf-client';

const data = {
  title: 'common:text-subscribe-heading',
  description: 'common:text-subscribe-description',
  buttonText: 'common:button-subscribe',
};

interface Props {
  className?: string;
  disableBorderRadius?: boolean;
}

type FormValues = {
  phone: string;
};

const defaultValues = {
  phone: '',
};

const Subscription: React.FC<Props> = ({
  className = 'px-5 sm:px-8 md:px-16 2xl:px-24',
  disableBorderRadius = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  const { t } = useTranslation();
  const { title, description, buttonText } = data;
  async function onSubmit(input: FormValues) {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ phone: input.phone }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || t('common:subscribe-error'))
        return
      }
      toast.success(t('common:subscribe-success'))
    } catch (err) {
      toast.error(t('common:subscribe-error'))
    }
  }
  return (
    <div
      className={`${className} flex flex-col xl:flex-row justify-center xl:justify-between items-center rounded-lg bg-gray-200 py-10 md:py-14 lg:py-16`}
    >
      <div className="lg:-mt-2 xl:-mt-0.5 text-center ltr:xl:text-left rtl:xl:text-right mb-7 md:mb-8 lg:mb-9 xl:mb-0">
        <Text
          variant="mediumHeading"
          // className='mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5'
          className="sm:mb-0 md:mb-2.5 lg:mb-3 xl:mb-3.5"
        >
          {t(`${title}`)}
        </Text>
        <p className="text-body text-xs md:text-sm leading-6 md:leading-7">
          {t(`${description}`)}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-shrink-0 w-full sm:w-96 md:w-[545px]"
        noValidate
      >
        <div className="flex flex-col sm:flex-row items-start justify-end">
          <Input
            disableBorderRadius={disableBorderRadius}
            placeholderKey="forms:placeholder-phone-subscribe"
            type="tel"
            variant="solid"
            className="w-full"
            inputClassName="px-4 lg:px-7 h-12 lg:h-14 text-center ltr:sm:text-left rtl:sm:text-right bg-white"
            {...register('phone', {
              required: 'forms:phone-subscribe-required',
              pattern: {
                value: /^09[0-9]{9}$/,
                message: 'forms:phone-subscribe-error',
              },
            })}
            errorKey={errors.phone?.message}
          />
          <Button
            disableBorderRadius={disableBorderRadius}
            className="mt-3 sm:mt-0 w-full sm:w-auto ltr:sm:ml-2 rtl:sm:mr-2 md:h-full flex-shrink-0"
          >
            <span className="lg:py-0.5">{t(`${buttonText}`)}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Subscription;
