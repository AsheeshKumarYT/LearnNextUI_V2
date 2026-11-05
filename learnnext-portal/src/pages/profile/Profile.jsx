import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PORTAL_ROLES } from '@/config/roles';
import { Activity, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { TabPanel } from '@/components/ui';
import { SectionTabs } from '@/shared/clients/detail/ClientHero';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { profileApi } from '@/services/api';
import { ProfileHero } from './components/ProfileHero';
import { PersonalDetails } from './components/PersonalDetails';
import { SecurityCard } from './components/SecurityCard';
import { AccountCard } from './components/AccountCard';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { CoverPickerModal } from './components/CoverPickerModal';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';

const rise = (ms) => ({ animationDelay: `${ms}ms` });

// Phone section tabs (/profile?tab=…)
const TABS = [
  { value: 'details', label: 'Personal details', icon: UserRound },
  { value: 'security', label: 'Security', icon: ShieldCheck },
  { value: 'activity', label: 'Activity', icon: Activity },
];

/**
 * My Profile: hero (avatar, identity, contact), editable details, security (OTP password change) and account facts.
 * The hero replaces PageHeader. Saves go through profileApi and refresh the signed-in user everywhere (sidebar, header).
 */
export default function Profile() {
  const { user: account, role, updateUser } = useAuth();
  // The role shown (hero badge + Access level) is the one this visit continues as — e.g. Super Admin in the Super Admin
  // portal — not the fixed label stored on the account
  const user = useMemo(() => (account ? { ...account, role: PORTAL_ROLES[role]?.label ?? account.role } : account), [account, role]);
  const toast = useToast();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const activity = useAsync(() => profileApi.activity(), []);
  const mobile = useIsMobile();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'details';
  const openTab = (value) => setParams(value === 'details' ? {} : { tab: value }, { replace: true });

  const save = async (patch, message) => {
    try {
      const next = await profileApi.update(patch);
      updateUser(next);
      activity.reload();
      toast.success(message);
    } catch (e) {
      toast.error('Couldn’t save your profile', { description: e.message });
      throw e;
    }
  };

  if (!user) return null;

  const hero = (
    <ProfileHero
      user={user}
      onChangeAvatar={() => setAvatarOpen(true)}
      onChangeCover={() => setCoverOpen(true)}
      coverPaused={coverOpen || avatarOpen || passwordOpen}
      joined={mobile}
    />
  );
  const timeline = (
    <ActivityTimeline
      data={activity.data}
      loading={activity.loading}
      error={activity.error}
      onRetry={activity.reload}
      onSecure={() => setPasswordOpen(true)}
      // Same as the client's Activity history: count by the title, the period summary (no heatmap)
      count={activity.data?.entries.length}
      showHeatmap={false}
      lightTint
      // Phones: the Activity tab already names it
      hideHeaderOnMobile={mobile}
    />
  );
  const dialogs = (
    <>
      <AvatarPickerModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        user={user}
        onSave={(avatar) => save({ avatar }, avatar ? 'Profile picture updated' : 'Profile picture removed')}
      />
      <CoverPickerModal open={coverOpen} onClose={() => setCoverOpen(false)} current={user.cover} onSave={(cover) => save({ cover }, 'Cover updated')} />
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onChanged={(next) => {
          updateUser(next);
          activity.reload();
          toast.success('Password changed');
        }}
      />
    </>
  );

  // Phones: like Client details — the profile header with section tabs joined to its bottom edge, one section at a time
  // (the long single page of details, security and activity was a lot to scroll). Desktop keeps the one-page layout.
  if (mobile) {
    return (
      <div className="flex flex-col">
        <div className="animate-rise" style={rise(0)}>
          {hero}
        </div>
        {/* A direct child of the page column (not wrapped with the hero) so it can stay pinned under the top bar while
            the section scrolls — sticky only works inside its own parent */}
        <SectionTabs tabs={TABS} value={tab} onChange={openTab} ariaLabel="Profile sections" idBase="profile" />
        <TabPanel value={tab} idBase="profile" key={tab} className="mt-4 min-w-0">
          {tab === 'details' && <PersonalDetails user={user} departments={profileApi.departments()} onSave={(values) => save(values, 'Profile updated')} />}
          {tab === 'security' && (
            <div className="flex flex-col gap-3">
              <SecurityCard user={user} onChangePassword={() => setPasswordOpen(true)} />
              <AccountCard user={user} />
            </div>
          )}
          {tab === 'activity' && timeline}
        </TabPanel>
        {dialogs}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise" style={rise(0)}>
        {hero}
      </div>

      <div className="grid animate-rise items-start gap-6 lg:grid-cols-3" style={rise(120)}>
        <PersonalDetails
          user={user}
          departments={profileApi.departments()}
          onSave={(values) => save(values, 'Profile updated')}
          className="lg:col-span-2 lg:self-stretch"
        />
        {/* Stretches to the row height; Account grows so both columns end on the same line */}
        <div className="flex flex-col gap-6 lg:self-stretch">
          <SecurityCard user={user} onChangePassword={() => setPasswordOpen(true)} />
          <AccountCard user={user} className="lg:flex-1" />
        </div>
      </div>

      <div className="animate-rise" style={rise(220)}>
        {timeline}
      </div>

      {dialogs}
    </div>
  );
}
