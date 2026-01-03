import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessagesPanel from "@/components/MessagesPanel";

export default function MessagesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">الرسائل</h1>
                            <p className="text-[var(--foreground-muted)]">
                                تواصل مع البائعين والمشترين
                            </p>
                        </div>
                    </div>

                    {/* Messages Panel */}
                    <MessagesPanel />
                </div>
            </main>

            <Footer />
        </div>
    );
}
