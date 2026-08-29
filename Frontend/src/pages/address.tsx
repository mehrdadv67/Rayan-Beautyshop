import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import PageHeader from "@components/ui/page-header";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import { absoluteSiteUrl } from "@utils/site-url";
import { useAddress } from "@contexts/address/address.context";
import { useState } from "react";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { AddressItem } from "@contexts/address/address.utils";

export default function AddressPage() {
	const { t } = useTranslation("common");
	const { items, isEmpty, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddress();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<Partial<AddressItem>>({
		fullName: '',
		phone: '',
		address: '',
		city: '',
		postalCode: '',
		label: '',
		isDefault: false,
	});

	const resetForm = () => {
		setFormData({
			fullName: '',
			phone: '',
			address: '',
			city: '',
			postalCode: '',
			label: '',
			isDefault: false,
		});
		setEditingId(null);
		setIsFormOpen(false);
	};

 	const handleSubmit = (e: React.FormEvent) => {
 		e.preventDefault();
 		if (editingId) {
 			updateAddress(editingId, formData);
 		} else {
 			addAddress({
 				id: Date.now().toString(),
 				fullName: formData.fullName || '',
 				phone: formData.phone || '',
 				address: formData.address || '',
 				city: formData.city || '',
 				postalCode: formData.postalCode || '',
 				label: formData.label || '',
 				isDefault: formData.isDefault || false,
 			} as AddressItem);
 		}
 		resetForm();
 	};

	const handleEdit = (address: AddressItem) => {
		setFormData(address);
		setEditingId(address.id);
		setIsFormOpen(true);
	};

	const handleRemove = (id: string) => {
		if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
			removeAddress(id);
		}
	};

	return (
		<>
			<NextSeo
				title={`${t('text-page-address')} | ${siteSettings.name}`}
				description={siteSettings.description}
				canonical={absoluteSiteUrl('/address')}
			/>
			<PageHeader pageHeader="text-page-address" />
			<Container>
				<div className="py-16 lg:py-20">
					{isEmpty && !isFormOpen ? (
						<p className="text-center text-body">{t('text-address-empty', 'آدرس ذخیره شده‌ای وجود ندارد.')}</p>
					) : (
						<div className="space-y-6">
							{!isFormOpen && (
								<div className="flex justify-end">
									<Button onClick={() => setIsFormOpen(true)}>
										{t('text-add-address', 'افزودن آدرس جدید')}
									</Button>
								</div>
							)}

							{isFormOpen && (
								<form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
									<h3 className="text-lg font-semibold text-heading mb-4">
										{editingId ? t('text-edit-address', 'ویرایش آدرس') : t('text-add-address', 'افزودن آدرس جدید')}
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<Input labelKey="forms:label-full-name" {...{ name: 'fullName', placeholderKey: 'forms:placeholder-full-name' }} value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
										<Input labelKey="forms:label-phone" {...{ name: 'phone', placeholderKey: 'forms:placeholder-phone' }} value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
										<Input labelKey="forms:label-address" {...{ name: 'address', placeholderKey: 'forms:placeholder-address' }} value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
										<Input labelKey="forms:label-city" {...{ name: 'city', placeholderKey: 'forms:placeholder-city' }} value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
										<Input labelKey="forms:label-postal-code" {...{ name: 'postalCode', placeholderKey: 'forms:placeholder-postal-code' }} value={formData.postalCode || ''} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
										<Input labelKey="forms:label-address-label" {...{ name: 'label', placeholderKey: 'forms:placeholder-address-label' }} value={formData.label || ''} onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
									</div>
									<div className="flex items-center gap-2">
										<input type="checkbox" id="isDefault" checked={formData.isDefault || false} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
										<label htmlFor="isDefault" className="text-sm text-body">{t('text-set-as-default', 'آدرس پیش‌فرض')}</label>
									</div>
									<div className="flex gap-3">
										<Button type="submit">{editingId ? t('text-update-address', 'به‌روزرسانی') : t('text-save-address', 'ذخیره')}</Button>
										<Button type="button" variant="smoke" onClick={resetForm}>{t('text-cancel', 'لغو')}</Button>
									</div>
								</form>
							)}

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((item) => (
									<div key={item.id} className={`border rounded-lg p-4 ${item.isDefault ? 'border-heading bg-gray-50' : 'border-gray-200'}`}>
										<div className="flex justify-between items-start mb-2">
											<div>
												<h4 className="font-semibold text-heading">{item.fullName}</h4>
												{item.label && <span className="text-xs text-gray-500">{item.label}</span>}
											</div>
											{item.isDefault && <span className="text-xs bg-heading text-white px-2 py-1 rounded">{t('text-default', 'پیش‌فرض')}</span>}
										</div>
										<p className="text-sm text-body mb-1">{item.address}</p>
										<p className="text-sm text-body mb-1">{item.city}</p>
										<p className="text-sm text-body mb-3">{item.phone}</p>
										<div className="flex gap-2">
											<button onClick={() => handleEdit(item)} className="text-sm text-heading hover:underline">{t('text-edit', 'ویرایش')}</button>
											<button onClick={() => handleRemove(item.id)} className="text-sm text-red-500 hover:underline">{t('text-remove', 'حذف')}</button>
											{!item.isDefault && <button onClick={() => setDefaultAddress(item.id)} className="text-sm text-blue-500 hover:underline">{t('text-set-default', 'پیش‌فرض')}</button>}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<Subscription />
			</Container>
		</>
	);
}

AddressPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale!, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
