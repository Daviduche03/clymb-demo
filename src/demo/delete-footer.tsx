import { useState } from 'react';
import { PiTrashSimple } from 'react-icons/pi';
import { toast } from 'sonner';

import { deleteDemo } from '@/lib/api';
import { RemovedScreen } from './status-screens';

export const DeleteFooter = ({ slug, token }: { slug: string; token: string }) => {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return <RemovedScreen />;

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteDemo(slug, token);
      setDeleted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete. Try again.');
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <footer className="mt-10 border-t border-foreground/10 px-1 py-6">
      <div>
        <p className="text-[12px] text-foreground/50">
          Demo built by Clymb from your public posts. Delete it anytime.
        </p>
        <div className="mt-3 flex items-center gap-3">
          {confirming ? (
            <>
              <button
                onClick={remove}
                disabled={deleting}
                className="border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[12px] font-medium text-destructive disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[12px] text-foreground/60 underline decoration-foreground/20 underline-offset-4"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 text-[12px] text-foreground/60 underline decoration-foreground/20 underline-offset-4"
            >
              <PiTrashSimple className="h-3.5 w-3.5" />
              Delete this demo
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
