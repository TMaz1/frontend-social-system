import React, { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import CardDetail from "./pages/CardDetail/CardDetail";
import ProfilePage from "./pages/Profile/ProfilePage";
import Footer from "./components/Footer/Footer";
import SearchResults from "./pages/SearchResults/SearchResults";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";

import { ToastProvider } from "./context/ToastContext";
import { useCardContext } from "./context/CardContext";
import TopBanner from "./components/TopBanner/TopBanner";
import AppSkeletonOverlay from "./components/Loader/AppSkeletonOverlay/AppSkeletonOverlay";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestRoute } from "./routes/GuestRoute";

const App: React.FC = () => {
	const { isInitialised } = useCardContext();
	const [isReadyToRender, setIsReadyToRender] = React.useState(false);

	useEffect(() => {
		if (isInitialised) {
			requestAnimationFrame(() => {
				setIsReadyToRender(true);
			});
		}
	}, [isInitialised]);

	// BLOCK ENTIRE UI UNTIL READY
	if (!isInitialised || !isReadyToRender) {
		return <AppSkeletonOverlay />;
	}

	return (
		<HashRouter>
			<ToastProvider>
				<>
					<TopBanner />
					<Navbar />
				</>
				<Routes>
					{/* PUBLIC ROUTES */}
					<Route path="/" element={<Home />} />
					<Route path="/card/:id" element={<CardDetail />} />
					<Route path="/search" element={<SearchResults />} />
					<Route path="/profile/:name" element={<ProfilePage />} />

					{/* GUEST ONLY ROUTES */}
					<Route element={<GuestRoute />}>
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
					</Route>

					{/* PROTECTED ROUTES */}
					<Route element={<ProtectedRoute />}>
						<Route
							path="/profile/settings"
							element={<ProfileSettings />}
						/>
					</Route>
				</Routes>
				<Footer />
			</ToastProvider>
		</HashRouter>
	);
};

export default App;