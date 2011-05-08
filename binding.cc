#include <v8.h>
#include <node.h>
#include <Magick++.h>
#include <stdlib.h>

using namespace node;
using namespace v8;

#ifdef DEBUG
# define DEBUG_PRINT(...) fprintf(stderr, __VA_ARGS__)
# define ASSERT(x) assert(x)
#else
# define DEBUG_PRINT(...)
# define ASSERT(x)
#endif

class Image: ObjectWrap{

private:

    Magick::Image gm_image;

public:

    Image(){
    }
    ~Image(){
    }

    static void Init(Handle<Object> target){
        Local<FunctionTemplate> function_template = FunctionTemplate::New(New);

        function_template->InstanceTemplate()->SetInternalFieldCount(1);
        function_template->SetClassName(String::NewSymbol("Image"));

        NODE_SET_PROTOTYPE_METHOD(function_template, "readSync", ReadSync);
        NODE_SET_PROTOTYPE_METHOD(function_template, "read", Read);
        NODE_SET_PROTOTYPE_METHOD(function_template, "writeSync", WriteSync);
        NODE_SET_PROTOTYPE_METHOD(function_template, "crop", Crop);

        function_template->InstanceTemplate()->SetAccessor(String::NewSymbol("size"), Size);

        target->Set(String::NewSymbol("Image"), function_template->GetFunction());
    }

    static Handle<Value> New(const Arguments& args){
        HandleScope scope;

        Image* image = new Image();
        image->Wrap(args.This());

        return scope.Close(args.This());
    }

    struct image_request {
        Persistent<Function> callback;
        Image *image;
        char image_path[1];
    };

    static Handle<Value> Read(const Arguments& args){
        HandleScope scope;

        Image* image = ObjectWrap::Unwrap<Image>(args.This());

        String::Utf8Value image_path(args[0]->ToString());
        Local<Function> callback = Local<Function>::Cast(args[1]);

        image_request *ir = (image_request *)
            malloc(sizeof(image_request) + image_path.length() + 1);

        ir->callback = Persistent<Function>::New(callback);
        strncpy(ir->image_path, *image_path, image_path.length() + 1);

        ir->image = image;

        eio_custom(ReadEvent, EIO_PRI_DEFAULT, ReadAfter, ir);
        ev_ref(EV_DEFAULT_UC);
        image->Ref();

        return scope.Close(args.This());
    }

    static int ReadEvent(eio_req *request){
        image_request *ir = (image_request *)request->data;
        DEBUG_PRINT("before reading image %s\n", ir->image_path);
        
        // i cant get this to work :S
        ir->image->gm_image.read(ir->image_path);

        DEBUG_PRINT("after reading image %s\n", ir->image_path);
        return 0;
    }

    static int ReadAfter(eio_req *request) {
        HandleScope scope;
        ev_unref(EV_DEFAULT_UC);
        image_request *ir = (image_request *)request->data;
        Local<Value> argv[2];
        argv[0] = Local<Value>::New(Null());
        argv[1] = Integer::New(1); // thats another problem ir->image;
        TryCatch try_catch;
        ir->callback->Call(Context::GetCurrent()->Global(), 2, argv);
        if (try_catch.HasCaught()) {
            FatalException(try_catch);
        }
        ir->callback.Dispose();
        ir->image->Unref();
        free(ir);
        return 0;
    }

    static Handle<Value> ReadSync(const Arguments& args){
        HandleScope scope;

        Image* image = ObjectWrap::Unwrap<Image>(args.This());
        String::Utf8Value image_path(args[0]->ToString());
        image->gm_image.read(*image_path);

        return scope.Close(args.This());
    }

    static Handle<Value> Crop(const Arguments& args){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(args.This());

        int width(args[0]->NumberValue());
        int height(args[1]->NumberValue());
        int offsetX(args[2]->NumberValue());
        int offsetY(args[3]->NumberValue());

        Magick::Geometry geometry(width, height, offsetX, offsetY);

        image->gm_image.crop(geometry);

        return scope.Close(args.This());
    }

    static Handle<Value> WriteSync(const Arguments& args){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(args.This());

        String::Utf8Value image_path(args[0]->ToString());
        image->gm_image.write(*image_path);

        return scope.Close(args.This());
    }

    static Handle<Value> Size(Local<String> property, const AccessorInfo& info){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(info.This());

        Magick::Geometry geometry(image->gm_image.size());

        Local<Array> size = Array::New(2);

        size->Set(0, Integer::New(geometry.width()));
        size->Set(1, Integer::New(geometry.height()));

        return scope.Close(size);
    }

};

extern "C" {
    void init (Handle<Object> target){
        Magick::InitializeMagick(NULL);
        Image::Init(target);
    }
    NODE_MODULE(imagick, init);
}
