import config from '../universal/config';
import createMainRoutes from '../universal/routes/mainRoutes';
import createHome from './components/home/home';
import createHeader from './components/header/header';
import createQueue from './components/queue/queue';
import createDashboard from './components/dashboard/dashboard';

createMainRoutes(FlowRouter);
createHome(Template);
createQueue(Template);
createDashboard(Template);
createHeader(Template);
