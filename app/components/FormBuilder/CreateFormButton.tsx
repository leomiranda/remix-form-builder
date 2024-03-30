import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { action as indexAction } from '~/routes/_dashboard+/_index';
import { createFormSchema } from '~/schemas/form';
import { useIsSubmitting } from '~/utils/hooks/useIsSubmitting';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from '../ui/use-toast';
import { ErrorList } from '../ErrorList';
import { BsFileEarmarkPlus } from 'react-icons/bs';

export function CreateFormButton() {
	const navigate = useNavigate();
	const actionData = useActionData<typeof indexAction>();
	const [dialogOpen, setDialogOpen] = useState(false);
	const isSubmitting = useIsSubmitting();
	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(createFormSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: createFormSchema });
		},
		shouldValidate: 'onBlur',
	});

	useEffect(() => {
		console.log('🚀 ~ useEffect ~ actionData:', actionData);
		if (!actionData) return;
		if (actionData?.result?.status === 'success') {
			toast({
				title: 'Success',
				description: 'Form created successfully',
			});
			setDialogOpen(false);
			navigate('/builder/' + actionData?.formId);
		} else {
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
				<Button
					variant={'outline'}
					className="group border border-primary/20 h-[190px] flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
				>
					<BsFileEarmarkPlus className="font-bold text-xl text-muted-foreground" />
					<p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
						Create new form
					</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new form</DialogTitle>
					<DialogDescription>
						Create a new form to start collecting responses.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<Form method="post" {...getFormProps(form)}>
						<div className="mb-4">
							<Label>
								Name:
								<Input {...getInputProps(fields.name, { type: 'text' })} />
								<ErrorList id={fields.name.id} errors={fields.name?.errors} />
							</Label>
						</div>
						<div className="mb-4">
							<Label>
								Description:
								<Textarea {...getTextareaProps(fields.description)} />
								<ErrorList
									id={fields.description.id}
									errors={fields.description?.errors}
								/>
							</Label>
						</div>
						<ErrorList id={form.id} errors={form.errors} />
						<DialogFooter className="mt-6">
							<Button
								form={form.id}
								type="submit"
								disabled={isSubmitting}
								className="w-full"
							>
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
