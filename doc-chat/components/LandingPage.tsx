import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-bold mb-6">Welcome to AI Chatbot</h1>
            <p className="text-xl mb-8 text-center max-w-2xl">
                Upload your documents and chat with our AI to get instant insights and answers.
            </p>
            <div className="space-x-4">
                <Button asChild>
                    <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    )
}