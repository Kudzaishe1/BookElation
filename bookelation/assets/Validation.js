function Match()
{
    if(document.getElementById("Password").value === document.getElementById("Confirm").value)
    {
        window.alert("Click OK to Continue");
    }
    else
    {
        window.alert("Oops Passwords do not match, please try again");
    }
}