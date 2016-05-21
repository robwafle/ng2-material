import {
  Directive,
  Component,
  AfterContentInit,
  ElementRef,
  OnChanges,
  ContentChild,
  Input,
  Output,
  Optional,
  HostBinding
} from "@angular/core";
import {NgModel, NgControl, FORM_PROVIDERS} from "@angular/common";
import {ObservableWrapper, EventEmitter, TimerWrapper} from "@angular/common/src/facade/async";
import {isBlank} from "@angular/common/src/facade/lang";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";

// TODO(jd): <select> hasFocus/hasValue classes
// TODO(jd): input container validation styles.
// TODO(jelbourn): textarea resizing
// TODO(jelbourn): max-length counter


@Directive({
  selector: 'input[md-input],input.md-input,textarea[md-input],textarea.md-input',
  host: {
    'class': 'md-input',
    '[value]': 'value',
    '(input)': 'value=$event.target.value',
    '(focus)': 'setHasFocus(true)',
    '(blur)': 'setHasFocus(false)'
  },
  providers: [FORM_PROVIDERS]
})
export class MdInput {
  _value: string;
  private dom : BrowserDomAdapter;

  constructor(@Optional() private model: NgModel,
              @Optional() private control: NgControl) {
    this.dom = new BrowserDomAdapter();
  }

  @Input('value')
  set value(value: string) {
    this._value = value;
    TimerWrapper.setTimeout(() => this.mdChange.emit(this.value), 1);
  }

  get value(): string {
    let val = this.model ? this.model.value : this.control ? this.control.value : this._value;
    return !isBlank(val) ? val : '';
  }

  @Input()
  placeholder: string;
  @Output('valueChange')
  mdChange: EventEmitter<any> = new EventEmitter();
  @Output()
  mdFocusChange: EventEmitter<any> = new EventEmitter(false);

  setHasFocus(hasFocus: boolean) {
    ObservableWrapper.callEmit(this.mdFocusChange, hasFocus);
  }
}


@Component({
  selector: 'md-input-container',
  template: `<ng-content></ng-content><div class="md-errors-spacer"></div>`
})
export class MdInputContainer implements AfterContentInit, OnChanges {

  // The MdInput or MdTextarea inside of this container.
  @ContentChild(typeof(MdInput))
  _input: MdInput = null;

  // Whether the input inside of this container has a non-empty value.
  @HostBinding('class.md-input-has-value')
  inputHasValue: boolean = false;

  // Whether the input inside of this container has focus.
  @HostBinding('class.md-input-focused')
  inputHasFocus: boolean = false;

  // Whether the input inside of this container has a placeholder
  @HostBinding('class.md-input-has-placeholder')
  inputHasPlaceholder: boolean = false;

  private dom : BrowserDomAdapter;

  constructor(private _element: ElementRef) {
    this.dom = new BrowserDomAdapter();
  }

  ngOnChanges(_) {
    this.inputHasValue = this._input.value !== '';

    // TODO(jd): Is there something like @ContentChild that accepts a selector? I would prefer not to
    // use a directive for label elements because I cannot use a parent->child selector to make them
    // specific to md-input
    this.inputHasPlaceholder = !!this.dom.querySelector(this._element.nativeElement, 'label') && !!this._input.placeholder;
  }

  ngAfterContentInit() {
    // If there is no text input, just bail and do nothing.
    if (this._input === null) {
      return;
    }

    if (!this._input) {
      return;
    }

    // TODO(jd): :sob: what is the correct way to update these variables after the component initializes?
    //  any time I do it directly here, debug mode complains about values changing after being checked. I
    //  need to wait until the content has been initialized so that `_input` is there
    // For now, just wrap it in a setTimeout to let the change detection finish up, and then set the values...
    TimerWrapper.setTimeout(() => this.ngOnChanges({}), 0);

    // Listen to input changes and focus events so that we can apply the appropriate CSS
    // classes based on the input state.
    if (!this._input.mdChange) {
      return;
    }
    this._input.mdChange.subscribe((value: string) => {
      this.inputHasValue = value !== '';
    });

    this._input.mdFocusChange.subscribe((hasFocus: boolean) => {
      this.inputHasFocus = hasFocus
    });

  }
}

