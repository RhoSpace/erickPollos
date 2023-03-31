import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductApi } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/productService/product.service';
import { SaleService } from 'src/app/services/saleService/sale.service';
import { SaleApi } from 'src/app/models/sale.model';

@Component({
  selector: 'app-seller-view',
  templateUrl: './seller-view.component.html',
  styleUrls: ['./seller-view.component.scss']
})
export class SellerViewComponent implements OnInit {

  product: ProductApi | any = {};
  amountProduct: number = 0;
  amountProduct2: number = 0;
  nameSeller: string = "";

  amountProductCtrl: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
  Validators.required, Validators.pattern("^[1-9]$")]);

  amountProductCtrl2: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
  Validators.required, Validators.pattern("^[1-9]$")]);

  // Angular material table with pagination
  displayedColumns: string[] = ['Producto', 'Cantidad', 'CortaFecha', '_id',];
  dataSource = new MatTableDataSource<ProductApi>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private productService: ProductService,
    private modalService: NgbModal,
    private saleService: SaleService,
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  //Buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Buscar datos en api conectada a la base de datos atlas mongodb 
  getAllProducts() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //CAMINO A ACTUALIZAR PRODUCTO NORMAL
  getAllProductsFunction(id: string, sell: number) {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => this.updateProduct(id, sell)
    })
  }

  //CAMINO A ACTUALIZAR PRODUCTO CORTA FECHA
  getAllProductsFunction2(id: string, sell: number) {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => this.updateProductCortaFecha(id, sell)
    })
  }

  
  //PROCESO DE GENERAR ACTUALIZACIÓN DE PRODUCTO Y CREAR VENTA CORTA FECHA
  updateProduct(id: string, sell: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    if (productAux.Cantidad < sell) {
      alert("La cantidad vendida supera a la de la bodega")
      this.resetAmountProducts();
    } else if (this.nameSeller == "") {
      alert("Ingrese nombre de vendedor")
      this.resetAmountProducts();
    } else {
      productAux.Cantidad = productAux.Cantidad - sell;
      this.updateProductById(productAux);
      this.createSale(productAux);
    }
  }

  //PROCESO DE GENERAR ACTUALIZACIÓN DE PRODUCTO Y CREAR VENTA CORTA FECHA
  updateProductCortaFecha(id: string, sell: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    if (productAux.CortaFecha < sell) {
      alert("La cantidad vendida supera a la de la bodega");
      this.resetAmountProducts();
    } else if (this.nameSeller == "") {
      alert("Ingrese nombre de vendedor");
      this.resetAmountProducts();
    } else {
      productAux.CortaFecha = productAux.CortaFecha - sell;
      this.updateProductById(productAux);
      this.createSaleCortaFecha(productAux);
    }
  }

  //Actualizar producto especifico
  updateProductById(productAux: ProductApi) {
    this.productService.updateProduct(productAux).subscribe({
      next: (res) => {
        this.product = {};
        this.resetAmountProducts();
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }


  //METODOS SALE
  //Crear venta normal
  createSale(productAux: ProductApi) {
    let sale: SaleApi = {
      productId: productAux.Codigo,
      productType: "Normal",
      saleAmount: this.amountProduct,
      seller: this.nameSeller
    }
    this.saleService.registerSale(sale).subscribe({
      next: (res) => {
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }

  //Crear venta corta fecha
  createSaleCortaFecha(productAux: ProductApi) {
    let sale: SaleApi = {
      productId: productAux.Codigo,
      productType: "Corta Fecha",
      saleAmount: this.amountProduct2,
      seller: this.nameSeller
    }
    this.saleService.registerSale(sale).subscribe({
      next: (res) => {
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }


  //METODO ABRIR MODAL
  openModal(content: any) {
    this.modalService.open(content, { size: 'xl' },
      // { ariaLabelledBy: 'modal-basic-title' }
    ).result.then(
      (result) => {

      },
      (reason) => {
        this.ngOnInit();
      },
    );
  }

  resetAmountProducts(){
    this.amountProduct = 0;
    this.amountProduct2 = 0;
  }

  //BOTON REFRESCAR INFORMACIÓN
  refresh(): void {
    // window.location.reload();
    this.ngOnInit();
  }

  // doLogout() {
  //   this.router.navigateByUrl('login');
  // }

}
