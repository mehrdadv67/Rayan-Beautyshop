import Input from '@components/ui/input';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/text-area';
import { useCheckoutMutation } from '@framework/checkout/use-checkout';
import { useGetUserQuery } from '@framework/customer/use-get-user';
import { CheckBox } from '@components/ui/checkbox';
import Button from '@components/ui/button';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useAddress } from '@contexts/address/address.context';

interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
}

const CheckoutForm: React.FC = () => {
  const { t } = useTranslation();
  const { mutate: placeOrder, isPending } = useCheckoutMutation();
  const { data: user } = useGetUserQuery();
  const { items: savedAddresses, getAddressById } = useAddress();
  const [editable, setEditable] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutInputType>();

  // Prefill the form from the logged-in user's saved profile.
  React.useEffect(() => {
    if (!user) return;
    const userAddress = user.address;
    if (userAddress && savedAddresses.length > 0) {
      const matchedAddress = savedAddresses.find(
        (addr) => addr.address === userAddress || addr.city === user.city
      );
      if (matchedAddress) {
        setSelectedAddressId(matchedAddress.id);
        reset({
          firstName: (matchedAddress.fullName?.split(' ')[0] || user.firstName) ?? '',
          lastName: (matchedAddress.fullName?.split(' ').slice(1).join(' ') || user.lastName) ?? '',
          phone: (matchedAddress.phone || user.phoneNumber) ?? '',
          email: user.email ?? '',
          address: (matchedAddress.address || user.address) ?? '',
          city: (matchedAddress.city || user.city) ?? '',
          zipCode: (matchedAddress.postalCode || user.zipCode) ?? '',
        });
        return;
      }
    }
    reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phoneNumber ?? '',
      email: user.email ?? '',
      address: user.address ?? '',
      city: user.city ?? '',
      zipCode: user.zipCode ?? '',
    });
    const hasProfile = Boolean(
      user.firstName || user.lastName || user.address || user.phoneNumber
    );
    setEditable(!hasProfile);
  }, [user, reset, savedAddresses, getAddressById]);

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value;
    if (!addressId) {
      setSelectedAddressId(null);
      return;
    }
    const address = getAddressById(addressId);
    if (address) {
      setSelectedAddressId(address.id);
      reset({
        firstName: address.fullName?.split(' ')[0] || '',
        lastName: address.fullName?.split(' ').slice(1).join(' ') || '',
        phone: address.phone,
        email: user?.email ?? '',
        address: address.address,
        city: address.city,
        zipCode: address.postalCode || '',
      });
    }
  };

  function onSubmit(input: CheckoutInputType) {
    placeOrder(input);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 xl:mb-8">
        <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading">
          {t('text-shipping-address')}
        </h2>
        {user && (
          <button
            type="button"
            className="text-xs md:text-sm text-primary hover:text-heading transition duration-150 focus:outline-none"
            onClick={() => setEditable((v) => !v)}
          >
            {editable
              ? t('text-lock-shipping-details')
              : t('text-change-shipping-details')}
          </button>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center "
        noValidate
      >
        {savedAddresses.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold text-sm leading-none mb-3">
              {t('text-select-address', 'Select Address')}
            </label>
            <select
              value={selectedAddressId || ''}
              onChange={handleAddressSelect}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-heading"
            >
              <option value="">{t('text-choose-address', 'Choose an address')}</option>
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label || addr.fullName} - {addr.city}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col space-y-4 lg:space-y-5">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              disabled={!editable}
              {...register('firstName', {
                required: 'forms:first-name-required',
              })}
              errorKey={errors.firstName?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />
            <Input
              labelKey="forms:label-last-name"
              disabled={!editable}
              {...register('lastName', {
                required: 'forms:last-name-required',
              })}
              errorKey={errors.lastName?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <Input
            labelKey="forms:label-address"
            disabled={!editable}
            {...register('address', {
              required: 'forms:address-required',
            })}
            errorKey={errors.address?.message}
            variant="solid"
          />
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="tel"
              labelKey="forms:label-phone"
              disabled={!editable}
              {...register('phone', {
                required: 'forms:phone-required',
              })}
              errorKey={errors.phone?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              type="email"
              labelKey="forms:label-email-star"
              disabled={!editable}
              {...register('email', {
                required: 'forms:email-required',
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'forms:email-error',
                },
              })}
              errorKey={errors.email?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-city"
              disabled={!editable}
              {...register('city')}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              labelKey="forms:label-postcode"
              disabled={!editable}
              {...register('zipCode')}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="relative flex items-center ">
            <CheckBox labelKey="forms:label-save-information" {...register('save')} />
          </div>
          <TextArea
            labelKey="forms:label-order-notes"
            {...register('note')}
            placeholderKey="forms:placeholder-order-notes"
            className="relative pt-3 xl:pt-6"
          />
          <div className="flex w-full">
            <Button
              className="w-full sm:w-auto"
              loading={isPending}
              disabled={isPending}
            >
              {t('common:button-place-order')}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
