import { AccountSettings, Profile } from "./lib/authentication";
import * as opaque from "@serenity-kit/opaque";

class Internals {
    accountSettings?: AccountSettings;
    profile?: Profile;
    opaque = opaque;

    setAccountSettings(settings: AccountSettings) {
        this.accountSettings = settings;
    }

    setProfile(profile: Profile) {
        this.profile = profile;
    }

    getAccountSettings() {
        return this.accountSettings;
    }

    getProfile() {
        return this.profile;
    }
}


export default Internals;
