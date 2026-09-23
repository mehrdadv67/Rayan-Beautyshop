import React from "react";
import Button from "@components/ui/button";
import { useTranslation } from "next-i18next";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 text-center px-4">
          <h2 className="text-2xl font-bold text-heading mb-4">
            خطایی رخ داده
          </h2>
          <p className="text-body mb-8">
            لطفاً صفحه رو رفرش کنید یا دوباره تلاش کنید.
            {this.state.error?.message && (
              <code className="block mt-2 text-xs text-red-500 bg-gray-100 p-2 rounded">
                {this.state.error.message}
              </code>
            )}
          </p>
          <Button onClick={() => window.location.reload()}>
            رفرش صفحه
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
