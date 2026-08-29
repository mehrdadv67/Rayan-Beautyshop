import { motion } from 'framer-motion';
import { fadeInTop } from '@utils/motion/fade-in-top';
import Link from '@components/ui/link';
import TrashIcon from '@components/icons/trash-icon';
import Counter from '@components/common/counter';
import { useWindowSize } from '@utils/use-window-size';
import { useSsrCompatible } from '@utils/use-ssr-compatible';
import { useTranslation } from 'next-i18next';
import { useOrdersQuery } from '@framework/order/get-all-orders';
import { useCart } from '@contexts/cart/cart.context';
import { Order } from '@framework/types';
import { useState, useMemo, useCallback } from 'react';

type OrderTab = 'active' | 'completed';

const OrdersTable: React.FC = () => {
  const { width } = useSsrCompatible(useWindowSize(), { width: 0, height: 0 });
  const { t } = useTranslation('common');
  const { data, isLoading, error } = useOrdersQuery();
  const { items: cartItems, isEmpty: cartEmpty, removeItemFromCart, updateItemQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<OrderTab>('active');

  const handleRemove = useCallback((id: string | number) => {
    removeItemFromCart(String(id));
  }, [removeItemFromCart]);

  const handleIncrement = useCallback((id: string | number) => {
    updateItemQuantity(String(id), (cartItems.find((ci) => String(ci.id) === String(id))?.quantity ?? 1) + 1);
  }, [updateItemQuantity, cartItems]);

  const handleDecrement = useCallback((id: string | number) => {
    const current = cartItems.find((ci) => String(ci.id) === String(id))?.quantity ?? 1;
    if (current > 1) {
      updateItemQuantity(String(id), current - 1);
    } else {
      removeItemFromCart(String(id));
    }
  }, [updateItemQuantity, removeItemFromCart, cartItems]);

  const allOrders = useMemo(() => data?.orders?.data ?? [], [data?.orders?.data]);

  const activeOrders = useMemo(
    () => allOrders.filter((o: Order) => o.status !== 'done' && o.status !== 'paid'),
    [allOrders],
  );
  const completedOrders = useMemo(
    () => allOrders.filter((o: Order) => o.status === 'done' || o.status === 'paid'),
    [allOrders],
  );

  const cartTotalQty = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems],
  );
  const cartTotalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [cartItems],
  );

  const orders = activeTab === 'active' ? activeOrders : completedOrders;

  const showError = Boolean(error) && !data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const statusLabel = (status?: string) => {
    switch (status) {
      case 'done': return t('text-order-status-done');
      case 'paid': return t('text-order-status-paid');
      case 'pending': return t('text-order-status-pending');
      case 'processing': return t('text-order-status-processing');
      case 'shipped': return t('text-order-status-shipped');
      case 'cancelled': return t('text-order-status-cancelled');
      default: return status || t('text-order-status-unknown');
    }
  };

  const renderCartItemsDesktop = () => {
    if (cartEmpty && !isLoading && activeOrders.length === 0) {
      return (
        <tr className="border-b border-gray-300">
          <td colSpan={6} className="px-4 py-5 text-center text-heading">
            {t('text-orders-not-found')}
          </td>
        </tr>
      );
    }

    if (cartEmpty) return null;

    return cartItems.map((item) => (
      <tr key={`cart-${item.id}`} className="border-b border-gray-300 bg-yellow-50/50 last:border-b-0">
        <td className="px-4 py-5 ltr:text-left rtl:text-right">
          <span className="text-body">{item.name || `${t('text-product')} #${item.id}`}</span>
          <span className="block text-xs text-gray-500 mt-1">{t('text-in-cart')}</span>
        </td>
        <td className="px-4 py-5 text-center text-heading">
          —
        </td>
        <td className="px-4 py-5 text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {t('text-in-cart')}
          </span>
        </td>
        <td className="px-4 py-5 text-center text-heading">
          <Counter
            quantity={item.quantity || 1}
            onIncrement={() => handleIncrement(item.id)}
            onDecrement={() => handleDecrement(item.id)}
            variant="dark"
          />
        </td>
        <td className="px-4 py-5 text-center text-heading">
            {(item.price * (item.quantity || 1)).toLocaleString()} {t('text-tooman')}
        </td>
        <td className="px-4 py-5 text-center text-heading">
          <div className="flex items-center gap-x-2">
            <Link
              href="/checkout"
              className="text-sm leading-4 bg-amber-500 text-white px-4 py-2.5 inline-block rounded-md hover:bg-amber-600"
            >
              {t('text-complete-purchase')}
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700 p-1"
              title={t('text-remove-from-cart')}
            >
              <TrashIcon width="16px" height="16px" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const renderCartItemsMobile = () => {
    if (cartEmpty && !isLoading && activeOrders.length === 0) {
      return (
        <div className="text-center text-heading py-5">{t('text-orders-not-found')}</div>
      );
    }

    if (cartEmpty) return null;

    return cartItems.map((item) => (
      <ul key={`cart-${item.id}`} className="flex flex-col px-4 pt-5 pb-6 space-y-5 text-sm font-semibold border border-amber-200 rounded-md text-heading bg-yellow-50/30">
        <li className="flex items-center justify-between">
          {t('text-order')}
          <span className="font-normal">{item.name || `${t('text-product')} #${item.id}`}</span>
        </li>
        <li className="flex items-center justify-between">
          {t('text-date')}
          <span className="font-normal">—</span>
        </li>
        <li className="flex items-center justify-between">
          {t('text-status')}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {t('text-in-cart')}
          </span>
        </li>
        <li className="flex items-center justify-between">
          {t('text-quantity')}
          <span className="font-normal">
            <Counter
              quantity={item.quantity || 1}
              onIncrement={() => handleIncrement(item.id)}
              onDecrement={() => handleDecrement(item.id)}
              variant="dark"
            />
          </span>
        </li>
        <li className="flex items-center justify-between">
          {t('text-total')}
          <span className="font-normal">{(item.price * (item.quantity || 1)).toLocaleString()} {t('text-tooman')}</span>
        </li>
        <li className="flex items-center justify-between">
          {t('text-actions')}
          <span className="font-normal flex items-center gap-x-2">
            <Link
              href="/checkout"
              className="text-sm leading-4 bg-amber-500 text-white px-4 py-2.5 inline-block rounded-md hover:bg-amber-600"
            >
              {t('text-complete-purchase')}
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700 p-1"
              title={t('text-remove-from-cart')}
            >
              <TrashIcon width="16px" height="16px" />
            </button>
          </span>
        </li>
      </ul>
    ));
  };

  const hasContent = () => {
    if (activeTab === 'active') {
      return !cartEmpty || activeOrders.length > 0;
    }
    return completedOrders.length > 0;
  };

  return (
    <>
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-heading xl:mb-8">
        {t('text-orders')}
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'active'
              ? 'border-b-2 border-heading text-heading'
              : 'text-gray-500 hover:text-heading'
          }`}
        >
          {t('text-active-orders')}
          <span className="mr-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {activeOrders.length + (cartEmpty ? 0 : 1)}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'completed'
              ? 'border-b-2 border-heading text-heading'
              : 'text-gray-500 hover:text-heading'
          }`}
        >
          {t('text-completed-orders')}
          <span className="mr-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {completedOrders.length}
          </span>
        </button>
      </div>

      {showError && (
        <p className="text-red-500 text-sm mb-4">{t('text-orders-loading-error')}</p>
      )}

      <motion.div
        layout
        initial="from"
        animate="to"
        exit="from"
        //@ts-ignore
        variants={fadeInTop(0.35)}
        className={`w-full flex flex-col`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-heading rounded-full animate-spin"></div>
          </div>
        ) : width >= 1025 ? (
          <table>
            <thead className="text-sm lg:text-base">
              <tr>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center ltr:first:rounded-tl-md rtl:first:rounded-tr-md">
                  {t('text-order')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center">
                  {t('text-date')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center">
                  {t('text-status')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center">
                  {t('text-quantity')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center">
                  {t('text-total')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading text-center ltr:last:rounded-tr-md rtl:last:rounded-tl-md">
                  {t('text-actions')}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-base">
              {/* Show cart items first in the "active" tab */}
              {activeTab === 'active' && renderCartItemsDesktop()}
              {orders.map((order: Order) => (
                <tr key={order.id} className="border-b border-gray-300 last:border-b-0">
                  <td className="px-4 py-5 ltr:text-left rtl:text-right">
                    <Link
                      href={`/my-account/orders/${order.slug ?? order.id}`}
                      className="underline hover:no-underline text-body"
                    >
                      #{order.slug ?? order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {statusLabel(order.status)}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {order.products?.length ?? '—'}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {order.total.toLocaleString()} {t('text-tooman')}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    <Link
                      href={`/my-account/orders/${order.slug ?? order.id}`}
                      className="text-sm leading-4 bg-heading text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
                    >
                      {t('button-view')}
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (activeTab === 'completed' || cartEmpty) && (
                <tr className="border-b border-gray-300">
                  <td colSpan={6} className="px-4 py-5 text-center text-heading">
                    {t('text-orders-not-found')}
                  </td>
                </tr>
              )}
              {activeTab === 'active' && !cartEmpty && (
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="px-4 py-5 text-center text-heading font-semibold">
                    جمع
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    —
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    —
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {cartTotalQty} {t('text-items')}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    {cartTotalPrice.toLocaleString()} {t('text-tooman')}
                  </td>
                  <td className="px-4 py-5 text-center text-heading">
                    <Link
                      href="/checkout"
                      className="text-sm leading-4 bg-heading text-white px-6 py-3 inline-block rounded-md hover:bg-gray-600"
                    >
                      {t('text-buy-all-products')}
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="w-full space-y-4">
            {activeTab === 'active' && renderCartItemsMobile()}
            {orders.map((order: Order) => (
              <ul key={order.id} className="flex flex-col px-4 pt-5 pb-6 space-y-5 text-sm font-semibold border border-gray-300 rounded-md text-heading">
                <li className="flex items-center justify-between">
                  {t('text-order')}
                  <span className="font-normal">
                    <Link
                      href={`/my-account/orders/${order.slug ?? order.id}`}
                      className="underline hover:no-underline text-body"
                    >
                      #{order.slug ?? order.id}
                    </Link>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-date')}
                  <span className="font-normal">{formatDate(order.created_at)}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-status')}
                  <span className="font-normal">{statusLabel(order.status)}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-quantity')}
                  <span className="font-normal">{order.products?.length ?? '—'}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-total')}
                  <span className="font-normal">{order.total.toLocaleString()} {t('text-tooman')}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-actions')}
                  <span className="font-normal">
                    <Link
                      href={`/my-account/orders/${order.slug ?? order.id}`}
                      className="text-sm leading-4 bg-heading text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
                    >
                      {t('button-view')}
                    </Link>
                  </span>
                </li>
              </ul>
            ))}
            {orders.length === 0 && (activeTab === 'completed' || cartEmpty) && (
              <div className="text-center text-heading py-5">{t('text-orders-not-found')}</div>
            )}
            {activeTab === 'active' && !cartEmpty && (
              <ul className="flex flex-col px-4 pt-5 pb-6 space-y-5 text-sm font-semibold border border-gray-300 rounded-md text-heading bg-gray-50">
                <li className="flex items-center justify-between">
                  {t('text-quantity')}
                  <span className="font-normal">{cartTotalQty} {t('text-items')}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-total')}
                  <span className="font-normal">{cartTotalPrice.toLocaleString()} {t('text-tooman')}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-actions')}
                  <span className="font-normal">
                    <Link
                      href="/checkout"
                      className="text-sm leading-4 bg-heading text-white px-6 py-3 inline-block rounded-md hover:bg-gray-600"
                    >
                      {t('text-buy-all-products')}
                    </Link>
                  </span>
                </li>
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default OrdersTable;
