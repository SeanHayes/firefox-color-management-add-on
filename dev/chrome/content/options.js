var optionsProperties = document.getElementById("options.properties");
var chooseProfileWindowTitle = optionsProperties.getString('chooseProfileWindowTitle');
var restartDialogTitle = optionsProperties.getString('restartDialogTitle');
var restartDialogMessage = optionsProperties.getString('restartDialogMessage');

function fileSelect()
{
	const nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, chooseProfileWindowTitle, nsIFilePicker.modeOpen);
	fp.appendFilter('Color Profiles', '*.icc;*.camp;*.gmmp;*.cdmp');
	fp.appendFilters(nsIFilePicker.filterAll);
	var os = navigator.platform.toLowerCase();
	if(typeof(os) != 'undefined')
	{
		var dir = '';
		var path_prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		path_prefs = path_prefs.getBranch("extensions.color_management.");
		
		if(os.indexOf("win") > -1)
		{
			dir = path_prefs.getCharPref("displayDirectory.win");
		}
		else if(os.indexOf("mac") > -1)
		{
			dir = path_prefs.getCharPref("displayDirectory.mac");
		}
		else if(os.indexOf("linux") > -1)
		{
			dir = path_prefs.getCharPref("displayDirectory.nix");
		}
		var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		//FIXME: If the directory doesn't exist the script fails silently here
		path.initWithPath(dir);
		if(path.exists())
		{
			fp.displayDirectory = path;
		}
	}
	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK)
	{
		var text_box = document.getElementById("profile_field");
		text_box.value = fp.file.path;
		var e = document.createEvent("Event");
		e.initEvent("change", true, true);
		text_box.dispatchEvent(e);
	}
}

function promptRestart()
{
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var restart = prompts.confirm(window, restartDialogTitle, restartDialogMessage);
	if(restart)
	{
		var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);
		appStartup.quit(Components.interfaces.nsIAppStartup.eRestart |Components.interfaces.nsIAppStartup.eAttemptQuit);
	}
	return true;
}
