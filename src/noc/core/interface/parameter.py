# ----------------------------------------------------------------------
# Interface parameters
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

from .error import InterfaceTypeError


class BaseParameter:
    """
    Abstract parameter
    """

    def __init__(self, required=True, default=None) -> None:
        self.required = required
        self.default = default
        if default is not None:
            self.default = self.clean(default)

    def __or__(self, other):
        """ORParameter syntax sugar"""
        return ORParameter(self, other)

    def raise_error(self, value, msg=""):
        """Raise InterfaceTypeError

        Args:
            value (Arbitrary python type): Value where error detected
            msg (String): Optional message
        Raises:
            InterfaceTypeError: Raised when the operation fails.
        """
        raise InterfaceTypeError(f"{self.__class__.__name__}: {value!r}. {msg}")

    def clean(self, value):
        """
        Input parameter normalization

        Args:
            value (Arbitrary python type): Input parameter
        Returns:
            Normalized value
        """
        return value

    def script_clean_input(self, profile, value):
        """
        Clean up script input parameters. Can be overloaded to
        handle profile specific.

        Args:
            profile (Profile instance): Profile
            value (Arbitrary python type): Input parameter
        Returns:
            Normalized value
        """
        return self.clean(value)

    def script_clean_result(self, profile, value):
        """
        Clean up script result parameters. Can be overloaded to
        handle profile specific.

        Args:
            profile (Profile instance): Profile
            value (Arbitrary python type): Input parameter
        Returns:
            Normalized value
        """
        return self.clean(value)

    def form_clean(self, value):
        """
        Clean up form field

        Args:
            value (Arbitrary python type): Input parameter
        Returns:
            Normalized value
        """
        # Third-party modules
        from django.forms import ValidationError

        if not value and not self.required:
            return self.default if self.default else None
        try:
            return self.clean(value)
        except InterfaceTypeError as e:
            raise ValidationError(e)

    def get_form_field(self, label=None):
        """
        Get appropriative form field
        """
        return {
            "xtype": "textfield",
            "name": label,
            "fieldLabel": label,
            "allowBlank": not self.required,
        }


class ORParameter(BaseParameter):
    """
    >>> ORParameter(IntParameter(),IPv4Parameter()).clean(10)
    10
    >>> ORParameter(IntParameter(),IPv4Parameter()).clean("192.168.1.1")
    '192.168.1.1'
    >>> ORParameter(IntParameter(),IPv4Parameter()).clean("xxx") #doctest: +IGNORE_EXCEPTION_DETAIL
    Traceback (most recent call last):
        ...
    InterfaceTypeError: IPv4Parameter: 'xxx'
    >>> (IntParameter()|IPv4Parameter()).clean(10)
    10
    >>> (IntParameter()|IPv4Parameter()).clean("192.168.1.1")
    '192.168.1.1'
    >>> (IntParameter()|IPv4Parameter()).clean("xxx") #doctest: +IGNORE_EXCEPTION_DETAIL
    Traceback (most recent call last):
        ...
    InterfaceTypeError: IPv4Parameter: 'xxx'
    >>> (IntParameter()|IPv4Parameter()).clean(None) #doctest: +IGNORE_EXCEPTION_DETAIL
    Traceback (most recent call last):
        ...
    InterfaceTypeError: IPv4Parameter: None.
    >>> (IntParameter(required=False)|IPv4Parameter(required=False)).clean(None)
    >>> (IntParameter(required=False)|IPv4Parameter()).clean(None) #doctest: +IGNORE_EXCEPTION_DETAIL
    Traceback (most recent call last):
        ...
    InterfaceTypeError: IPv4Parameter: None.
    """

    def __init__(self, left, right) -> None:
        super().__init__()
        self.left = left
        self.right = right
        self.required = self.left.required or self.right.required

    def clean(self, value):
        if value is None and self.required is False:
            return None
        try:
            return self.left.clean(value)
        except InterfaceTypeError:
            return self.right.clean(value)

    def script_clean_input(self, profile, value):
        try:
            return self.left.script_clean_input(profile, value)
        except InterfaceTypeError:
            return self.right.script_clean_input(profile, value)

    def script_clean_result(self, profile, value):
        try:
            return self.left.script_clean_result(profile, value)
        except InterfaceTypeError:
            return self.right.script_clean_result(profile, value)
