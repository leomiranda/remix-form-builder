interface ErrorListProps {
	id?: string;
	errors?: Array<string> | null;
}

export function ErrorList({ id, errors }: ErrorListProps) {
	return errors?.length ? (
		<ul id={id} className="flex flex-col gap-1 m-1 text-red-800">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null;
}
