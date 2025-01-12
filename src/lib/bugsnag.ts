import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY || '',
  plugins: [new BugsnagPluginReact()],
  releaseStage: process.env.NODE_ENV,
  enabledReleaseStages: ['production', 'staging'],
});

export const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary();

export default Bugsnag; 