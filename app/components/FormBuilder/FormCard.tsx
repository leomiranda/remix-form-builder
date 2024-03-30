import { Form } from '@prisma/client';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { formatDistance } from 'date-fns';
import { LuView } from 'react-icons/lu';
import { FaEdit, FaWpforms } from 'react-icons/fa';
import { Button } from '../ui/button';
import { Link } from '@remix-run/react';
import { BiRightArrowAlt } from 'react-icons/bi';

interface FormCardProps {
	form: Form;
}

export function FormCard({ form }: FormCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-2">
					<span className="truncate font-bold">{form.name}</span>
					{form.published ? (
						<Badge>Published</Badge>
					) : (
						<Badge variant={'destructive'}>Draft</Badge>
					)}
				</CardTitle>
				<CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
					{formatDistance(form.createdAt, new Date(), { addSuffix: true })}
					{form.published && (
						<span className="flex items-center gap-2">
							<LuView className="text-muted-foreground" />
							<span>{form.visits.toLocaleString()}</span>
							<FaWpforms className="text-muted-foreground" />
							<span>{form.submissions.toLocaleString()}</span>
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[20px] truncate text-sm text-muted-foreground">
				{form.description || 'No description'}
			</CardContent>
			<CardFooter>
				{form.published ? (
					<Button
						variant={'secondary'}
						asChild
						className="w-full mt-2 text-md gap-4"
					>
						<Link to={`/forms/${form.id}`}>
							View submissions <BiRightArrowAlt />
						</Link>
					</Button>
				) : (
					<Button
						variant={'secondary'}
						asChild
						className="w-full mt-2 text-md gap-4"
					>
						<Link to={`/builder/${form.id}`}>
							Edit form <FaEdit />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
