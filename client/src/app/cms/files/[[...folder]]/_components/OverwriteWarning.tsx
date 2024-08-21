import { Children } from '@/util/propTypes';

export default function OverwriteWarning({ children }: Children) {
  return (
    <>
      <div className="rounded-lg border border-amber-600 bg-amber-400/20 p-4 text-sm text-amber-900">
        <h4 className="font-bold">Conflicts found</h4>
        <p className="pt-2">
          {children ?? (
            <>
              At least one of the selected files already exists in the
              destination folder and will be overwritten.
            </>
          )}
          <i> Click the button again to confirm.</i>
        </p>
      </div>
    </>
  );
}
