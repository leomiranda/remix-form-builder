import { Form, useActionData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { useRemixForm } from 'remix-hook-form';
import { action as indexAction } from '~/routes/_layout._index';
import { createFormSchemaType, resolverCreateForm } from '~/schemas/form';
import { useHydrated } from '~/utils/hooks/useHydrated';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';

export function CreateFormButton() {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		register,
		reset,
	} = useRemixForm<createFormSchemaType>({
		mode: 'onSubmit',
		resolver: resolverCreateForm,
		defaultValues: {
			name: '',
			description: '',
		},
	});
	const actionData = useActionData<typeof indexAction>();
	const [dialogOpen, setDialogOpen] = useState(false);
	const isHydrated = useHydrated();

	useEffect(() => {
		if (!actionData) return;
		if (actionData?.success) {
			reset();
			toast({
				title: 'Success',
				description: 'Form created successfully',
			});
			setDialogOpen(false);
		} else if (!actionData?.success) {
			toast({
				title: 'Error',
				description: 'Something went wrong, please try again later',
				variant: 'destructive',
			});
		}
	}, [actionData]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button>Create new form</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new form</DialogTitle>
					<DialogDescription>
						Create a new form to start collecting responses.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<Form onSubmit={handleSubmit} noValidate={isHydrated}>
						<div className="mb-4">
							<Label>
								Name:
								<Input
									type="text"
									{...register('name')}
									autoComplete="off"
									required
									maxLength={100}
								/>
								{errors.name && (
									<p className="mt-2 mb-4 text-rose-600">
										{errors.name.message}
									</p>
								)}
							</Label>
						</div>
						<div className="mb-4">
							<Label>
								Description:
								<Textarea {...register('description')} maxLength={1000} />
								{errors.description && <p>{errors.description.message}</p>}
							</Label>
						</div>
						<DialogFooter className="mt-6">
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting && <ImSpinner2 className="animate-spin" />}
								{!isSubmitting && <>Save</>}
							</Button>
						</DialogFooter>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
