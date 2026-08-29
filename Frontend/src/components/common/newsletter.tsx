import Button from "@components/ui/button";
import Input from "@components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useUI } from "@contexts/ui.context";
import { toast } from "react-toastify";
import { useState } from "react";
import { csrfHeaders } from "@utils/csrf-client";
interface NewsLetterFormValues {
  phone: string;
}
const defaultValues = {
  phone: "",
};
export default function Newsletter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsLetterFormValues>({
    defaultValues,
  });
  const { closeModal } = useUI();
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation('common');
  async function onSubmit(values: NewsLetterFormValues) {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ phone: values.phone }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || t('common:subscribe-error'))
        return
      }
      setIsSuccess(true)
      toast.success(t('common:subscribe-success'))
      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (err) {
      toast.error(t('common:subscribe-error'))
    }
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:w-[450px] md:w-[550px] lg:w-[980px] xl:w-[1170px] flex flex-col max-w-full max-h-full bg-white overflow-hidden rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0 items-center justify-center bg-gray-200 hidden lg:flex lg:w-[520px] xl:w-[655px]">
            <Image
              src="/assets/images/newsletter.jpg"
              alt="Thumbnail"
              width={655}
              height={655}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col px-5 py-7 sm:p-10 md:p-12 xl:p-14 text-center w-full">
            {isSuccess ? (
              <>
                <h2 className="text-heading text-lg sm:text-xl md:text-2xl leading-8 font-bold mb-5 sm:mb-7 md:mb-9">
                  {t('common:subscribe-success')}
                </h2>
                <p className="text-body text-sm leading-6 md:leading-7">
                  {t('common:subscribe-success-message')}
                </p>
              </>
            ) : (
              <>
                <h4 className="uppercase font-semibold text-xs sm:text-sm text-body mb-2 lg:mb-4">
                  {t("common:text-subscribe-now")}
                </h4>
                <h2 className="text-heading text-lg sm:text-xl md:text-2xl leading-8 font-bold mb-5 sm:mb-7 md:mb-9">
                  {t("common:text-newsletter-title")}
                </h2>
                <p className="text-body text-sm leading-6 md:leading-7">
                  {t("common:text-newsletter-subtitle")}
                </p>
                <form
                  className="pt-8 sm:pt-10 md:pt-14 mb-1 sm:mb-0"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    placeholderKey="forms:placeholder-phone-subscribe"
                    type="tel"
                    variant="solid"
                    className="w-full"
                    inputClassName="px-4 lg:px-7 h-12 lg:h-14 text-center bg-gray-50"
                    {...register("phone", {
                      required: "forms:phone-subscribe-required",
                      pattern: {
                        value: /^09[0-9]{9}$/,
                        message: "forms:phone-subscribe-error",
                      },
                    })}
                    errorKey={errors.phone?.message}
                  />
                  <Button className="w-full h-12 lg:h-14 mt-3 sm:mt-4">
                    {t("common:button-subscribe")}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
