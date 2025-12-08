// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { store } from './app/store';
// // import { AuthInitializer } from './features/auth/components/AuthInitializer';
// import AppRoutes from './routes/AppRoutes';
// import './styles/globals.css';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//       staleTime: 5 * 60 * 1000,
//     },
//   },
// });

// function App() {
//   return (
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <BrowserRouter>
//           {/* <AuthInitializer> */}
//             <AppRoutes />
//             <Toaster position="top-right" />
//           {/* </AuthInitializer> */}
//         </BrowserRouter>
//         <ReactQueryDevtools initialIsOpen={false} />
//       </QueryClientProvider>
//     </Provider>
//   );
// }

// export default App;


// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import { AuthInitializer } from './features/auth/components/AuthInitializer'; // ✅ Import it
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthInitializer> 
            <AppRoutes />
            <Toaster position="top-right" />
          </AuthInitializer> 
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;