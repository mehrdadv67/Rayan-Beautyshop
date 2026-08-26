import Input from '@components/ui/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { fadeInTop } from '@utils/motion/fade-in-top';
import {
  useUpdateUserMutation,
  UpdateUserType,
} from '@framework/customer/use-update-customer';
import { RadioBox } from '@components/ui/radiobox';
import { useTranslation } from 'next-i18next';
import { useGetUserQuery } from '@framework/customer/use-get-user';
import { User } from '@framework/types';
import { useEffect } from 'react';

const AccountDetails: React.FC = () => {
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetUserQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      displayName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      address: '',
      city: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: (user as User).firstName || '',
        lastName: (user as User).lastName || '',
        displayName: (user as User).username || '',
        phoneNumber: (user as User).phoneNumber || '',
        email: (user as User).email || '',
        password: '',
        confirmPassword: '',
        gender: (user as User).gender || '',
        address: (user as User).address || '',
        city: (user as User).city || '',
        zipCode: (user as User).zipCode || '',
      });
    }
  }, [user, reset]);

  function onSubmit(input: UpdateUserType) {
    updateUser(input);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      //@ts-ignore
      variants={fadeInTop(0.35)}
      className={`w-full flex flex-col`}
    >
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t('common:text-account-details')}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:gap-x-3 space-y-4 sm:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              {...register('firstName', {
                required: 'forms:first-name-required',
              })}
              variant="solid"
              className="w-full sm:w-1/2"
              errorKey={errors.firstName?.message}
            />
            <Input
              labelKey="forms:label-last-name"
              {...register('lastName', {
                required: 'forms:last-name-required',
              })}
              variant="solid"
              className="w-full sm:w-1/2"
              errorKey={errors.lastName?.message}
            />
          </div>
          <Input
            labelKey="forms:label-display-name"
            {...register('displayName', {
              required: 'forms:display-name-required',
            })}
            variant="solid"
            errorKey={errors.displayName?.message}
          />
          <div className="flex flex-col sm:flex-row sm:gap-x-3 space-y-4 sm:space-y-0">
            <Input
              type="tel"
              labelKey="forms:label-phone"
              {...register('phoneNumber')}
              variant="solid"
              className="w-full sm:w-1/2"
            />
            <Input
              type="email"
              labelKey="forms:label-email-star"
              {...register('email')}
              variant="solid"
              className="w-full sm:w-1/2"
            />
          </div>
          <div className="relative flex flex-col">
            <span className="mt-2 text-sm text-heading font-semibold block pb-1">
              {t('common:text-gender')}
            </span>
            <div className="mt-2 flex items-center gap-x-6">
              <RadioBox
                labelKey="forms:label-male"
                {...register('gender')}
                value="male"
              />
              <RadioBox
                labelKey="forms:label-female"
                {...register('gender')}
                value="female"
              />
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-heading mt-6 mb-4">
            {t('common:text-address')}
          </h3>
          <Input
            labelKey="forms:label-address"
            {...register('address', {
              required: 'forms:address-required',
            })}
            variant="solid"
            errorKey={errors.address?.message}
          />
          <div className="flex flex-col sm:flex-row sm:gap-x-3 space-y-4 sm:space-y-0">
            <Input
              labelKey="forms:label-city"
              {...register('city')}
              variant="solid"
              className="w-full sm:w-1/2"
            />
            <Input
              labelKey="forms:label-postcode"
              {...register('zipCode')}
              variant="solid"
              className="w-full sm:w-1/2 ltr:sm:ml-3 rtl:sm:mr-3"
            />
          </div>
          <div className="relative">
            <Button
              type="submit"
              loading={isPending}
              disabled={isPending}
              className="h-12 mt-3 w-full sm:w-32"
            >
              {isPending ? 'در حال ذخیره...' : t('common:button-save')}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AccountDetails;
