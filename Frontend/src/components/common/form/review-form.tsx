import Input from '@components/ui/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/text-area';
import ReactStars from 'react-rating-stars-component';
import { CheckBox } from '@components/ui/checkbox';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { csrfHeaders } from '@utils/csrf-client';

interface ReviewFormValues {
  name: string;
  email: string;
  cookie: string;
  message: string;
}

interface ReviewFormProps {
  productId?: string | number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>();
  const [rating, setRating] = useState(0);
  const { t } = useTranslation('common');

  async function onSubmit(values: ReviewFormValues) {
    if (!rating) {
      toast.error(t('common:review-rating-required'));
      return;
    }

    try {
      const body = {
        name: values.name,
        email: values.email,
        rating,
        message: values.message,
        productId: productId || undefined,
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
      toast.error(result.details || result.error || t('common:review-error'));
      return;
    }

      toast.success(t('common:review-success'));
    reset();
    setRating(0);
  } catch (err) {
    toast.error(t('common:review-error'));
  }
  }

  const ratingChanged = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto flex flex-col justify-center mt-6 lg:mt-8"
      noValidate
    >
      <div className="flex flex-col space-y-5 md:space-y-6 lg:space-y-7">
        <div className="pb-1.5">
          <label className="block text-gray-600 font-semibold text-sm leading-none mb-3 cursor-pointer">
            {t('forms:label-your-rating')}
          </label>
          <ReactStars
            count={5}
            value={rating}
            onChange={ratingChanged}
            size={20}
            color="#c6c6c6"
            activeColor="#202020"
          />
        </div>
        <TextArea
          labelKey="forms:label-message-star"
          {...register('message', { required: t('forms:message-required') })}
          errorKey={errors.message?.message}
        />
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
          <Input
            labelKey="forms:label-name-star"
            {...register('name', { required: t('forms:name-required-persian') })}
            className="w-full md:w-1/2 "
            errorKey={errors.name?.message}
            variant="solid"
          />
          <Input
            labelKey="forms:label-email-star"
            type="email"
            {...register('email', {
              required: t('forms:email-required-persian'),
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: t('forms:email-invalid-persian'),
              },
            })}
            className="w-full md:w-1/2 ltr:md:ml-2.5 rtl:md:mr-2.5 ltr:lg:ml-5 rtl:lg:mr-5 mt-2 md:mt-0"
            errorKey={errors.email?.message}
            variant="solid"
          />
        </div>
        <CheckBox
          {...register('cookie')}
          labelKey="forms:label-save-review-information"
        />
        <div className="pt-1">
          <Button
            type="submit"
            className="h-12 md:mt-1 text-sm lg:text-base w-full sm:w-auto"
          >
            {t('common:button-submit')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
