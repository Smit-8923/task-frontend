import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/auth.service';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        strNewPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!token) {
            setError('Missing reset token. Please request a new link.');
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.strNewPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Missing token');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.resetPassword(token, formData.strNewPassword);
            if (response.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.message || 'Failed to reset password.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    <Card className="border-none shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl">Password Reset!</CardTitle>
                            <CardDescription>
                                Your password has been successfully reset. Redirecting to login...
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link to="/login">Go to login</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Set new password
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Please enter your new password below.
                    </p>
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">New Password</CardTitle>
                        <CardDescription>
                            Create a strong password for your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            {error && (
                                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>{error}</p>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="strNewPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="strNewPassword"
                                        name="strNewPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                        value={formData.strNewPassword}
                                        onChange={handleChange}
                                        disabled={isLoading || !token}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading || !token}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit" disabled={isLoading || !token}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                            <Button asChild variant="ghost" className="w-full">
                                <Link to="/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to login
                                </Link>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
