import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.PROD !== true && typeof console !== "undefined") {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  handleReset() {
    this.setState({ hasError: false });
    this.props.onReset?.();
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section
        dir="rtl"
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: "#fff",
            border: "1px solid #e4e7df",
            borderRadius: 28,
            padding: 32,
            boxShadow: "0 8px 26px rgba(24, 38, 18, 0.04)",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1a2517" }}>
            حدث خطأ في عرض هذه الصفحة
          </p>
          <p style={{ margin: "0 0 24px", color: "#6f746b", lineHeight: 1.9 }}>
            يمكنك الرجوع للوحة التحكم أو إعادة المحاولة.
          </p>
          {this.props.onReset && (
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                background: "#176b2c",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {this.props.resetLabel || "العودة للوحة التحكم"}
            </button>
          )}
        </div>
      </section>
    );
  }
}
