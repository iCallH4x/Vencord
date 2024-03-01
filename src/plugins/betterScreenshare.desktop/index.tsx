import { definePluginSettings } from "@api/Settings";
import { DefinedSettings, OptionType, Patch, PluginAuthor, PluginDef, SettingsDefinition } from "@utils/types";
import definePlugin from "@utils/types";
import { addSettingsPanelButton, Emitter, removeSettingsPanelButton, ScreenshareSettingsIcon } from "../philsPluginLibrary";
import { PluginInfo } from "./constants";
import { Devs } from "@utils/constants";
import { openScreenshareModal } from "./modals";
import { ScreenshareAudioPatcher, ScreensharePatcher } from "./patchers";
import { replacedScreenshareModalComponent } from "./patches";
import { initScreenshareAudioStore, initScreenshareStore } from "./stores";

export default definePlugin({
    name: "BetterScreenshare",
    description: "Makes your screensharing better",
    authors: [Devs.iCallH4x],
    patches: [
        {
            find: "Messages.SCREENSHARE_RELAUNCH",
            replacement: {
                match: /(function .{1,2}\(.{1,2}\){)(.{1,40}(?=selectGuild).+?(?:]}\)}\)))(})/,
                replace: "$1return $self.replacedScreenshareModalComponent(function(){$2}, this, arguments)$3"
            }
        }
    ],
    settings: definePluginSettings({
        hideDefaultSettings: {
            type: OptionType.BOOLEAN,
            description: "Hide Discord screen sharing settings",
            default: true,
        }
    }),
    dependencies: ["PhilsPluginLibrary"],
    start: function() {
        initScreenshareStore();
        initScreenshareAudioStore();
        this.screensharePatcher = new ScreensharePatcher().patch();
        this.screenshareAudioPatcher = new ScreenshareAudioPatcher().patch();

        addSettingsPanelButton({
            name: "BetterScreenshare",
            icon: ScreenshareSettingsIcon,
            tooltipText: "Screenshare Settings",
            onClick: openScreenshareModal
        });
    },
    stop: function() {
        this.screensharePatcher?.unpatch();
        this.screenshareAudioPatcher?.unpatch();
        Emitter.removeAllListeners("BetterScreenshare");

        removeSettingsPanelButton("BetterScreenshare");
    }
});
