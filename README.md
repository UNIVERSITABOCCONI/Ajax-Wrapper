Ajax-Wrapper
============

Ajax-Wrapper library

To work properly you need FontAwesome installed (https://fortawesome.github.io/Font-Awesome/ ) and JQuery 2.1.1 at least.

How to pack:

```
PS C:\work\Ajax-Wrapper> nuget.exe pack .\ajax-wrapper.nuspec
```

How to publish:

```
PS C:\work\Ajax-Wrapper> nuget.exe push .\Ajax-Wrapper.js.9.1.0.nupkg -Source http://nuget.sm.unibocconi.it/NuGetServer/nuget
```

## Minimal working example

```
<script src="/jquery.js"></script>
<script src="/ajax-wrapper.js"></script>
<script>
function useAjax() {
    APEXNET_ajaxWrapper_Library.ajax("/something", {
        onDone(response) {
            console.log(response);
        }
    });
}
</script>
```

Since 9.2.0 you can use this library to get blobs from remote sources.
