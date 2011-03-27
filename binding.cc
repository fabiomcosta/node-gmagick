#include <v8.h>
#include <node.h>
#include <Magick++.h>
#include <stdlib.h>

using namespace node;
using namespace v8;

# define DEBUG_PRINT(...) fprintf(stderr, __VA_ARGS__)

class Image: ObjectWrap{

private:

    Magick::Image magick_image;

public:

    Image(){
    }
    ~Image(){
    }

    static void Init(Handle<Object> target){
        Local<FunctionTemplate> function_template = FunctionTemplate::New(New);

        function_template->InstanceTemplate()->SetInternalFieldCount(1);
        function_template->SetClassName(String::NewSymbol("Image"));

        NODE_SET_PROTOTYPE_METHOD(function_template, "save", Save);
        NODE_SET_PROTOTYPE_METHOD(function_template, "crop", Crop);

        function_template->InstanceTemplate()->SetAccessor(String::NewSymbol("size"), Size);

        target->Set(String::NewSymbol("Image"), function_template->GetFunction());
    }

    static Handle<Value> New(const Arguments& args){
        HandleScope scope;

        Image* image = new Image();

        if (args[0]->IsUndefined()){
            return ThrowException(Exception::Error(String::New("A image path should be specified.")));
        }

        String::Utf8Value image_path(args[0]->ToString());

        // if (!File.Stat(*image_path)){
        //     return ThrowException(Exception::Error(String::New("Image path does not exists.")));
        // }

        image->magick_image.read(*image_path);

        image->Wrap(args.This());
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
        
        if ((width + offsetX <= 0) || (height + offsetY <= 0) || !geometry.isValid()){
            return ThrowException(Exception::Error(String::New("Passed values make an invalid crop region.")));
        }
        
        image->magick_image.crop(geometry);

        return scope.Close(args.This());
    }

    static Handle<Value> Save(const Arguments& args){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(args.This());

        String::Utf8Value image_path(args[0]->ToString());
        image->magick_image.write(*image_path);

        return scope.Close(args.This());
    }

    static Handle<Value> Size(Local<String> property, const AccessorInfo& info){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(info.This());

        Magick::Geometry geometry(image->magick_image.size());

        Local<Array> size = Array::New(2);

        size->Set(0, Integer::New(geometry.width()));
        size->Set(1, Integer::New(geometry.height()));

        return scope.Close(size);
    }

};

extern "C" {
    void init (Handle<Object> target){
        Image::Init(target);
    }
    NODE_MODULE(imagick, init);
}  