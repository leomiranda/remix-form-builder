import { ImSpinner2 } from 'react-icons/im';
import { createFormSchemaType, resolverCreateForm } from '~/schemas/form';
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
import { Textarea } from './ui/textarea';
import { useRemixForm } from 'remix-hook-form';
import { Form, useActionData } from '@remix-run/react';
import { Label } from './ui/label';
import { action as indexAction } from '~/routes/_layout._index';
import { useEffect, useState } from 'react';
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
					<Form onSubmit={handleSubmit}>
						<div className="mb-4">
							<Label htmlFor="name">
								Name:
								<Input type="text" {...register('name')} autoComplete="off" />
								{errors.name && (
									<p className="mt-2 mb-4 text-rose-600">
										{errors.name.message}
									</p>
								)}
							</Label>
						</div>
						<div className="mb-4">
							<Label htmlFor="description">
								Description:
								<Textarea {...register('description')} />
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
