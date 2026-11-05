import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { AuthHeading } from './components/AuthHeading';

export default function ResetSuccess() {
  return (
    <>
      <AuthHeading
        icon={CircleCheck}
        tone="success"
        title="Password updated"
        description="Your password has been reset successfully. You can now sign in with your new password."
      />
      <Button as={Link} to="/login" size="lg" fullWidth rightIcon={ArrowRight}>
        Continue to sign in
      </Button>
    </>
  );
}
