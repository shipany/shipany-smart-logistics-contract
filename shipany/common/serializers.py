# related third party imports
from rest_framework.serializers import ModelSerializer

def contain_only_already_exist_error(errors):
    # Example value for errors:
    # serializer.errors = {'id': [u'System with this id already exists.']}

    # print('contain_only_already_exist_error: errors = %s' % (errors))
    if not errors:
        return False

    for (k, v) in errors.iteritems():
        if isinstance(v, dict):
            for (k2, error) in v.iteritems():
                print("error_str = (%s, %s)" %(k2,error))

                if "already exists" not in error:
                    return False
        elif isinstance(v, list):
            for i, item in enumerate(v):
                print("error_str = (%s, %s)" %(k, item))

                if "already exists" not in v:
                    return False

    return True

class ExtendedModelSerializer(ModelSerializer):
    def is_valid_ex(self, raise_exception=False):
        assert not hasattr(self, 'restore_object'), (
            'Serializer `%s.%s` has old-style version 2 `.restore_object()` '
            'that is no longer compatible with REST framework 3. '
            'Use the new-style `.create()` and `.update()` methods instead.' %
            (self.__class__.__module__, self.__class__.__name__)
        )

        assert hasattr(self, 'initial_data'), (
            'Cannot call `.is_valid()` as no `data=` keyword argument was '
            'passed when instantiating the serializer instance.'
        )

        if not hasattr(self, '_validated_data'):
            try:
                # self._validated_data = self.run_validation(self.initial_data)
                # skip validation
                self._validated_data = self.initial_data
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}

        if self._errors and raise_exception:
            raise ValidationError(self.errors)

        return not bool(self._errors)
