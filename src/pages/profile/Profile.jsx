import ProfileLayout from "../../components/ProfileLayout";
import PersonalInfo from "../../components/PersonalInfo";
import OrderHistory from "../../components/OrderHistory";
import Favorites from "../../components/Favorites";
import LoyaltyRewards from "../../components/LoyaltyRewards";
import HelpSupport from "../../components/HelpSupport";

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <PersonalInfo />
      <OrderHistory />
      <Favorites />
      <LoyaltyRewards />
      <HelpSupport />
    </ProfileLayout>
  );
}
