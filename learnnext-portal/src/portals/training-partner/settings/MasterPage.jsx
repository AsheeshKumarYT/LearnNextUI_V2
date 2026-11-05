import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Construction, SearchX } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MASTERS, RECENT_KEY } from './settingsMasters';
import EntityList from './entity/EntityList';
import SubEntityList from './sub-entity/SubEntityList';
import SapBpList from './sap-bp/SapBpList';
import ExpenseHeadList from './expense-head/ExpenseHeadList';
import CountryList from './locations/CountryList';
import StateList from './locations/StateList';
import CityList from './locations/CityList';
import DepartmentList from './people/DepartmentList';
import DesignationList from './people/DesignationList';
import RoleList from './people/RoleList';
import IndustryList from './people/IndustryList';
import ProgramCategoryList from './program-category/ProgramCategoryList';
import ModuleList from './modules/ModuleList';
import MenuMappingList from './menu-mapping/MenuMappingList';
import RolesAccess from './roles-access/RolesAccess';

// Masters that have their own page so far (slug → component); the rest show the placeholder below
const BUILT = { entity: EntityList, 'sub-entity': SubEntityList, 'sap-bp': SapBpList, 'expense-head': ExpenseHeadList, country: CountryList, state: StateList, city: CityList, department: DepartmentList, designation: DesignationList, role: RoleList, 'industry-type': IndustryList, 'program-category': ProgramCategoryList, modules: ModuleList, 'menu-mapping-access': MenuMappingList, 'roles-access': RolesAccess };

/**
 * One master (/settings/:slug). Placeholder until each master's list/form is built. The header shows
 * "Settings › <master>" (the Settings crumb links back); the empty state offers a way back to the master's group too.
 */
export default function MasterPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const entry = MASTERS[slug];
  const [, setRecent] = useLocalStorage(RECENT_KEY, []);

  // Remember this master for Settings → "Recently opened" (newest first, no duplicates)
  useEffect(() => {
    if (entry) setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 12));
  }, [slug, entry, setRecent]);
  // Back to Settings, landing on this master's group
  const back = (
    <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(entry ? `/settings#${entry.group.id}` : '/settings')}>
      {entry ? entry.group.title : 'Settings'}
    </Button>
  );

  if (!entry) {
    return (
      <Card className="flex flex-col justify-center lg:flex-1">
        <EmptyState icon={SearchX} title="This master doesn’t exist" description="It may have been renamed. Pick one from Settings." action={back} />
      </Card>
    );
  }

  const Built = BUILT[slug];
  if (Built) return <Built />;

  const { item, group } = entry;
  return (
    // Fills the page height (see AdminLayout), message centred
    <Card className="flex flex-col justify-center lg:flex-1">
      <EmptyState icon={Construction} title={`${item.label} is on the way`} description={`${group.title} · ${item.description}. Its list and form will be built here.`} action={back} />
    </Card>
  );
}
